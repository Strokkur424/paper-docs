import { GITHUB_OPTIONS } from "./git";

// this is resolved on build-time, not by the client

interface Latest {
  release: string;
  snapshot: string;
}

interface Version {
  id: string;
  type: "release" | "snapshot" | "old_beta" | "old_alpha";
}

interface Manifest {
  latest: Latest;
  versions: Version[];
}

interface Tag {
  name: string;
}

const fetchGitHubTags = async (repo: string) =>
  await fetch(`https://api.github.com/repos/${repo}/tags`, GITHUB_OPTIONS)
    .then((r) => (r.ok ? r.json() : [{ name: "v0.0.0" }]))
    .then((tags: Tag[]) => tags.map((t) => t.name.substring(1)));

// prettier-ignore
const manifest: Manifest = await fetch("https://piston-meta.mojang.com/mc/game/version_manifest_v2.json")
  .then((r) => r.json());

export const LATEST_MC_RELEASE = manifest.latest.release;

interface Project {
  project_id: string;
  project_name: string;
  version_groups: string[];
  versions: string[];
}

const paperProject: Project = await fetch("https://api.papermc.io/v2/projects/paper").then((r) => r.json());

export const LATEST_PAPER_RELEASE = paperProject.versions[paperProject.versions.length - 1];

const velocityProject: Project = await fetch("https://api.papermc.io/v2/projects/velocity").then((r) => r.json());

export const LATEST_VELOCITY_RELEASE = velocityProject.versions[velocityProject.versions.length - 1];

const foliaProject: Project = await fetch("https://api.papermc.io/v2/projects/folia").then((r) => r.json());

export const LATEST_FOLIA_RELEASE = foliaProject.versions[foliaProject.versions.length - 1];

const waterfallProject: Project = await fetch("https://api.papermc.io/v2/projects/waterfall").then((r) => r.json());

export const LATEST_WATERFALL_RELEASE = waterfallProject.versions[waterfallProject.versions.length - 1];

const userdevVersions: string[] = await fetchGitHubTags("PaperMC/paperweight");

export const LATEST_USERDEV_RELEASE = userdevVersions[0];

export const LATEST_ADVENTURE_API_RELEASE = "4.22.0";
export const LATEST_ADVENTURE_PLATFORM_RELEASE = "4.4.0";
export const LATEST_ADVENTURE_PLATFORM_MOD_RELEASE = "6.4.0";
export const LATEST_ANSI_RELEASE = "1.1.1";
