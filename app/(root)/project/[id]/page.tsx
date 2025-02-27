import { client } from "@/sanity/lib/client";
import { PROJECT_QUERY, RECOMMENDED_PROJECTS_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import markdownit from "markdown-it";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import ProjectCard, { ProjectCardType } from "@/components/ProjectCard";

const md = markdownit();

export const experimental_ppr = true;

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  // First fetch the current project
  const post = await client.fetch(PROJECT_QUERY, { id });
  
  if (!post) return notFound();

  // Then fetch recommended projects using the current project's data
  const recommendedPosts = await client.fetch(RECOMMENDED_PROJECTS_QUERY, {
    currentId: id,
    category: post.category,
    authorId: post.author._id
  });

  const parsedContent = md.render(post?.pitch || "");

  return (
    <>
      {/* Heading Section */}
      <section className="tertiary_container !min-h-[230px] mb-0 p-0">
        <p className="tag">{formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>

      {/* Image Section */}
      <section className="section_container mt-[-20px]">
        <img
          src={post.image}
          alt={`${post.title}'s representative image`}
          className="w-full rounded-xl object-cover h-[calc(100vh-250px)] md:h-[calc(100vh-300px)] image-no-min" 
        />

        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link href={`/user/${post.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <Image src={post.author.image}
                alt={`${post.author.username}'s avatar`}
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />

              <div>
                <p className="text-20-medium">{post.author.name}</p>
                <p className="text-16-medium !text-black-300">@{post.author.username}</p>
              </div>

            </Link>

            <p className="category-tag">{post.category}</p>

          </div>

          <h3 className="text-30-bold">Pitch</h3>

          {parsedContent ? (
            <article
              className="prose max-w-4xl font-work-sans"
              dangerouslySetInnerHTML={{__html: parsedContent}}  
            />
          ) : (
            <p className="no-result">
              No Details Provided.
            </p>
          )}

        </div>

        <hr className="divider" />
        
        {/* Recommended Projects Section */}
        {recommendedPosts?.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <p className="text-30-semibold">You Might Love These</p>

            <ul className="mt-7 card_grid-sm">
              {recommendedPosts.map((post: ProjectCardType) => (
                <ProjectCard key={post._id} post={post} />
              ))}
            </ul>
          </div>
        )}

      </section>

      <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={id} />
      </Suspense>
    </>
  );
};

export default Page;
