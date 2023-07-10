import Head from 'next/head';
import { SliceZone } from '@prismicio/react';
import * as prismic from '@prismicio/client';

import { createClient } from '@/prismicio';
import { components } from '@/slices';

/**
 * This component renders your homepage.
 *
 * Next's Head component renders the page's metadata.
 *
 * Use the SliceZone to render the content of the page.
 */
export default function Index({ page }) {
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

export async function getStaticProps({ previewData }) {
  /**
   * The client queries content from the Prismic API
   */
  const client = createClient({ previewData });

  const page = await client.getByUID('page', 'home');

  return {
    props: {
      page,
    },
  };
}
