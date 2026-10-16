import { getSiteContent } from "./site-content.service";
import { directoryHeroPages, directoryHeroSchema, type DirectoryHero, type DirectoryHeroPage } from "../schemas/directory-hero.schema";

export async function getDirectoryHero(page: DirectoryHeroPage): Promise<DirectoryHero> {
  const { key, defaults } = directoryHeroPages[page];
  return await getSiteContent(key, directoryHeroSchema) ?? defaults;
}
