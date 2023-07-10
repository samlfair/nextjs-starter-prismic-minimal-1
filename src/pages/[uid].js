import Head from 'next/head';
import { SliceZone } from '@prismicio/react';
import * as prismic from '@prismicio/client';

import { createClient } from '@/prismicio';
import { components } from '@/slices';

/**
 * This page renders a Prismic Document dynamically based on the URL.
 */
export default function Page({ page }) {
  return (
    <main>
      <Head>
        <title>{page.data.meta_title}</title>
        <meta property="og:title" content={page.data.meta_title} key="title" />
        <meta
          property="og:image"
          content={prismic.asImageSrc(page.data.meta_image, {
            width: 1200,
            height: 630,
          })}
          key="image"
        />
        <meta
          property="og:description"
          content={page.data.meta_description}
          key="description"
        />
      </Head>
      <SliceZone slices={page.data.slices} components={components} />
    </main>
  );
}

export async function getStaticProps({ params, previewData }) {
  const client = createClient({ previewData });

  const page = await client.getByUID('page', params.uid);

  return {
    props: {
      page,
    },
  };
}

export async function getStaticPaths() {
  const client = createClient();

  /**
   * Query all Documents from the API, except the homepage.
   */
  const pages = await client.getAllByType('page', {
    predicates: [prismic.predicate.not('my.page.uid', 'home')],
  });

  /**
   * Define a path for every Document.
   */
  return {
    paths: pages.map((page) => {
      return prismic.asLink(page);
    }),
    fallback: false,
  };
}
