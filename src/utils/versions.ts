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

const userdevVersions: string[] = await fetch("https://api.github.com/repos/PaperMC/paperweight/tags")
  .then((r) => r.json())
  .then((json) => json.map((e) => e.name.substring(1)));

export const LATEST_USERDEV_RELEASE = userdevVersions[0];
