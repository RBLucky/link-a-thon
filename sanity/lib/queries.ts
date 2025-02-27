import { defineQuery } from "next-sanity";

export const PROJECTS_QUERY = defineQuery(`*[_type == "project" && defined(slug.current) && !defined($search) || title match $search || category match $search || author->name match $search ] | order(_createdAt desc){
  _id,
  title,
  slug,
  _createdAt,
  author -> {
    _id, name, image, bio
  },
  views,
  description,
  category,
  image
}`
);

export const PROJECT_QUERY = defineQuery(`*[_type == "project" && _id == $id][0] {
  _id,
  title,
  slug,
  _createdAt,
  author -> {
    _id, name, username, image, bio
  },
  views,
  description,
  category,
  image,
  pitch
}`
);

export const RECOMMENDED_PROJECTS_QUERY = defineQuery(`*[_type == "project" && _id != $currentId] {
  _id,
  title,
  slug,
  _createdAt,
  "score": select(
    category == $category => 2,
    0
  ) + select(
    author._ref == $authorId => 1.5,
    0
  ) + select(
    dateTime(_createdAt) > dateTime(now()) - 60*60*24*30 => 1,
    0
  ) + select(
    coalesce(views, 0) > 100 => 0.5,
    0
  ),
  author-> {
    _id,
    name,
    username,
    image,
    bio
  },
  views,
  description,
  category,
  image
} | order(score desc)[0...3]`
);

export const PROJECT_VIEWS_QUERY = defineQuery(`*[_type == "project" && _id == $id][0]{
  _id,
  views
}`
);

export const AUTHOR_BY_GITHUB_ID_QUERY = defineQuery(`*[_type == "author" && id == $id][0]{
  _id,
  id,
  name,
  username,
  email,
  image,
  bio
}`
);

export const AUTHOR_BY_ID_QUERY = defineQuery(`*[_type == "author" && _id == $id][0]{
  _id,
  id,
  name,
  username,
  email,
  image,
  bio
}`
);

export const PROJECTS_BY_AUTHOR_QUERY = defineQuery(`*[_type == "project" && author._ref == $id]| order(_createdAt desc){
  _id,
  title,
  slug,
  _createdAt,
  author -> {
    _id, name, image, bio
  },
  views,
  description,
  category,
  image
}`
);
