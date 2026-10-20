import { test } from "node:test";
import assert from "node:assert/strict";
import { testDatabase, migration } from "../../../lib/testing/database";

test("admin saves roll back records, child lists and revisions together and reject non-admin callers", async () => {
  const db = await testDatabase();
  try {
    await db.exec(migration("20261016_appointment_insert_and_doctor_details.sql"));
    await db.exec(migration("20261020152834_atomic_admin_content_saves.sql"));
    const save = (kind: string, data: unknown) => db.query("SELECT public.admin_save_content($1,$2::jsonb,'Test',NULL)",[kind,JSON.stringify(data)]);
    await db.exec("SET ROLE authenticated");
    await assert.rejects(save("service",{}), /Administrator access required/);
    await db.exec(`SELECT set_config('request.jwt.claims','{"app_metadata":{"role":"admin"},"email":"admin@example.test"}',false)`);
    const service = { id:"service-test",name:"Original",slug:"original",short_description:"Short",description:"Full",image:"/images/a.jpg",badge:"",badge_variant:"blue",featured:false,category:"general" };
    await save("service",{ record:service });
    await db.exec("UPDATE services SET sort_order=7 WHERE id='service-test'");
    await save("service",{ record:{...service,name:"Updated"} });
    assert.equal((await db.query<{ sort_order:number }>("SELECT sort_order FROM services WHERE id='service-test'")).rows[0].sort_order,7);

    const doctor = {id:"doctor-test",name:"Original doctor",slug:"doctor-test",avatar:"/images/d.jpg",position:"Doctor",experience:10,sort_order:1,degree:"BS",description:"Description",badge:"",highlight:"",category:"implant",directory_title:"Implant",languages:[]};
    await save("doctor",{record:doctor,specialties:["Original specialty"],education:["Original education"],certificates:[]});
    await assert.rejects(save("doctor",{record:{...doctor,name:"Should roll back"},specialties:["New specialty"],education:[],certificates:[{issuer:"Missing title"}]}));
    assert.equal((await db.query<{ name:string }>("SELECT name FROM doctors WHERE id='doctor-test'")).rows[0].name,"Original doctor");
    assert.equal((await db.query<{ specialty:string }>("SELECT specialty FROM doctor_specialties WHERE doctor_id='doctor-test'")).rows[0].specialty,"Original specialty");

    await save("service-detail",{serviceId:"service-test",image:"/images/new.jpg",content:{title:"Detail"}});
    assert.equal((await db.query<{ image:string }>("SELECT image FROM services WHERE id='service-test'")).rows[0].image,"/images/new.jpg");
    await assert.rejects(save("service-detail",{serviceId:"service-test",image:"/images/should-rollback.jpg"}));
    assert.equal((await db.query<{ image:string }>("SELECT image FROM services WHERE id='service-test'")).rows[0].image,"/images/new.jpg");
    await assert.rejects(save("contact-cta",{content:{showPhone:true},phones:[{id:"clinic-test",phone:"NEW"},{id:"missing",phone:"OTHER"}]}),/Clinic not found/);
    assert.equal((await db.query<{ phone:string }>("SELECT phone FROM clinics WHERE id='clinic-test'")).rows[0].phone,"+84912345678");

    await db.exec("RESET ROLE; ALTER TABLE admin_content_revisions ADD CONSTRAINT reject_test_article CHECK(kind <> 'article') NOT VALID; SET ROLE authenticated");
    await assert.rejects(save("article",{record:{id:"article-test",title:"Title",slug:"article-test",excerpt:"Excerpt",content:"Content",thumbnail:"/images/a.jpg",author:"Author",category:"general",reading_minutes:3,featured:false,status:"published"}}),/reject_test_article/);
    assert.equal((await db.query<{ total:number }>("SELECT count(*)::int AS total FROM articles WHERE id='article-test'")).rows[0].total,0);
    assert.equal((await db.query<{ total:number }>("SELECT count(*)::int AS total FROM admin_content_revisions WHERE kind='doctor'")).rows[0].total,1);
  } finally { await db.close(); }
});
