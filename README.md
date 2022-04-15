# Frontend Mentor - Product feedback app solution

This is a solution to the [Product feedback app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/product-feedback-app-wbvUYqjR6). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)

## Overview

### The challenge

The challenge is to build out this product feedback application and get it looking as close to the reference design as possible.

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Create, read, update, and delete product feedback requests
- Receive form validations when trying to create/edit feedback requests
- Sort suggestions by most/least upvotes and most/least comments
- Filter suggestions by category
- Add comments and replies to a product feedback request
- Upvote product feedback requests
- **Bonus**: Keep track of any changes, even after refreshing the browser (`localStorage` could be used for this if you're not building out a full-stack app)

#### Expected Behaviour

- **Suggestions page**
  - Only product feedback requests with a status of `suggestion` should be shown on the Suggestions page.
- **Roadmap**
  - Feedback requests with a status of `planned`, `in-progress`, or `live` should show up on the roadmap, and should be placed in the correct column based on their status.
  - Columns should be ordered by upvote totals.
- **Creating a product request**
  - When creating a new piece of feedback, an ID needs to be assigned which increments the current highest product request ID by 1.
  - The default status for a new piece of feedback is `suggestion`. This places it on the Suggestions page.
- **Editing feedback**
  - If a piece of feedback has its status updated to `planned`/`in-progress`/`live` it moves through to the roadmap and should show up in the correct column based on its new status.
- **Add comments/replies**
  - Use the data from the `currentUser` object in the `data.json` file to populate the user data for any new comments or replies.
  - Any comment/reply can have a maximum of 250 characters.

### Screenshot

![Reference Design](./design/reference/preview.jpg)

### Links

- [Repository](https://github.com/richardcyrus/fm-rmx-product-feedback-app)
- [Live Site](https://fm-rmx-product-feedback-app.vercel.app/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow
- [Remix](https://remix.run/) - a full stack web framework.
- [React](https://reactjs.org/) - JS library.
- [Reach UI](https://reach.tech/) - React-based design system.
- [Prisma](https://www.prisma.io/) - Next-generation Node.js and TypeScript ORM.
- [Cypress](https://www.cypress.io) - JavaScript end-to-end testing framework.
- [Vitest](https://vitest.dev) - A blazing fast unit-test framework powered by Vite.
- [Testing Library](https://testing-library.com) - Simple and complete testing utilities that encourage good testing practices.

### What I learned

- The testing configuration, using `vitest` is based on the `Indie Stack` from the Remix stacks starter project. I also used the "Testing JavaScript" course by Kent C. Dodds to help me on my journey in testing this Frontend Mentor challenge.
- [Creating a recursive component](https://medium.com/@singhajendra1998/recursive-components-in-react-ac1be1110db1): This was used in the display of comments in the feedback detail view. Currently, in the interest of time and limitations in Prisma's query structure, only three levels of nesting are displayed.
- [React Pre-rendering and Potential Hydration Issue](https://blog.jannikwempe.com/react-pre-rendering-and-potential-hydration-issue): This was used to resolve a React browser warning when updating the upvotes from local storage, but the upvote count in the database was different.

### Continued development

I initially started this project with a Next JS implementation. I will likely revisit that implementation and make changes based on what I've done here.

I decided to re-implement in Remix, to go back to my roots in web development. Other than learning basic TypeScript as part of this (and the initial Next JS implementation), I managed to simplify the app significantly.

- The `<CommentReply />` component and `React.forwardRef()`:
  - I'd prefer if this were a traditional function declaration. I think it makes it easier to read. However, my attempt to convert it, caused TypeScript to complain about the `ref` property when using the component in a recursive manner, I don't know yet how to get TypeScript to not complain (without a `ts-ignore` directive).

### Useful resources

- [My Custom CSS Reset](https://www.joshwcomeau.com/css/custom-css-reset/)
- [A Modern CSS Reset](https://piccalil.li/blog/a-modern-css-reset/)
- [Notes on Josh Comeau’s Custom CSS Reset](https://css-tricks.com/notes-on-josh-comeaus-custom-css-reset/)
- [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [React TypeScript Cheatsheets](https://react-typescript-cheatsheet.netlify.app/)
- [UI Events KeyboardEvent key Values](https://www.w3.org/TR/uievents-key/#named-key-attribute-values)
- [React + TypeScript: Handling Keyboard Events](https://www.kindacode.com/article/react-typescript-handling-keyboard-events/)
- [Forwarding React Refs with TypeScript](https://www.carlrippon.com/react-forwardref-typescript/)
- [Hiding Content for Accessibility](https://snook.ca/archives/html_and_css/hiding-content-for-accessibility)
- [How-to: Hide content](https://www.a11yproject.com/posts/how-to-hide-content/)
- [Visually Hidden](https://reach.tech/visually-hidden)
- [Remix: Sharing Your Index Layout with Sub-Routes](https://dev.to/pckilgore/remix-sharing-your-index-layout-with-sub-routes-2856)
- [Remix | Styling](https://remix.run/docs/en/v1/guides/styling#postcss)
- [How to Use PostCSS as a Configurable Alternative to Sass](https://www.sitepoint.com/postcss-sass-configurable-alternative/)
- [Styling Remix using Tailwind and PostCSS](https://codegino.com/blog/remix-styling-tailwind-postcss)
- [Using localStorage with React Hooks](https://blog.logrocket.com/using-localstorage-react-hooks/)
- [toTitleCase | 30 Seconds of TypeScript](https://decipher.dev/30-seconds-of-typescript/docs/toTitleCase/)

## Author

- Website - [www.richardcyrus.com](https://www.richardcyrus.com)
- Frontend Mentor - [@richardcyrus](https://www.frontendmentor.io/profile/richardcyrus)
