import { Post } from '@prisma/client';

export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (
    value !== null &&
    typeof value === 'object' &&
    !Object.keys(value).length
  ) {
    return true;
  } else {
    return false;
  }
};

// export const formatPost = (post: Post) => {
//   return {
//     ...post,
//     self: `post/${post.id}`,
//     owner: {
//       name: post.au,
//       self:
//     }

//   };
// };

// export const formatPostsToResponse = (posts: Post[]) => {};
