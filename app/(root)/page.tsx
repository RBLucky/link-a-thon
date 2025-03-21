import { auth } from "@/auth";
import ProjectCard, { ProjectCardType } from "@/components/ProjectCard";
import SearchForm from "@/components/SearchForm";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";
import { unstable_noStore } from "next/cache";

export const experimental_ppr = true;

export default async function Home({ searchParams }: { searchParams: Promise<{ query?: string }>}) {

  unstable_noStore();

  const query = (await searchParams).query;

  const params = { search: query || null };

  const session = await auth();

  console.log(`Session ID: ${session?.id}`);

  const { data: posts } = await sanityFetch({
    query: PROJECTS_QUERY,
    params,
    tags: ['project', 'views']
  });

  return (
    <>
      <section className="tertiary_container">
        <h1 className="heading">Pitch Your Project, <br /> Connect With Talent</h1>

        <p className="sub-heading !max-w-3xl">Showcase Ideas, Collaborate on Projects, and Get Noticed in Hackathons</p>

        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : 'All Projects'}
        </p>
        
        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: ProjectCardType) => (
              <ProjectCard key={post?._id} post={post} />
            ))
          ) : (
            <p className="no-results">No Projects Found</p>
          )}
        </ul>
      </section>

      <SanityLive />
    </>
  );
}
