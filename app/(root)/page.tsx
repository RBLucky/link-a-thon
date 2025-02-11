import ProjectCard from "@/components/ProjectCard";
import SearchForm from "@/components/SearchForm";
import { client } from "@/sanity/lib/client";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";

export default async function Home({ searchParams }: { searchParams: Promise<{ query?: string }>}) {

  const query = (await searchParams).query;

  const posts = await client.fetch(PROJECTS_QUERY);

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
            posts.map((post: ProjectCardType, index: number) => (
              <ProjectCard key={post?._id} post={post} />
            ))
          ) : (
            <p className="no-results">No Projects Found</p>
          )}
        </ul>
      </section>
    </>
  );
}
