import React from "react";
import { Helmet } from "react-helmet-async";

const defaultMeta = {
  title: "Game Finder - Odkryj najlepsze gry",
  description:
    "Przeglądaj, wyszukuj i zapisuj swoje ulubione gry w jednym miejscu. Game Finder to aplikacja dla wszystkich pasjonatów gier.",
  canonical: "https://game-finder.example.com",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://game-finder.example.com",
    site_name: "Game Finder",
    images: [
      {
        url: "https://game-finder.example.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Game Finder - Odkryj najlepsze gry",
      },
    ],
  },
  twitter: {
    handle: "@gamefinder",
    site: "@gamefinder",
    cardType: "summary_large_image",
  },
};

/**
 * Komponent zarządzający metadanymi dla SEO
 * @param {Object} props - Właściwości komponentu
 * @param {string} props.title - Tytuł strony (dołączany do nazwy aplikacji)
 * @param {string} props.description - Opis strony dla SEO
 * @param {string} props.canonical - Kanoniczny URL strony
 * @param {Object} props.openGraph - Właściwości Open Graph
 * @param {Object} props.twitter - Właściwości Twitter Card
 * @param {boolean} props.noIndex - Czy strona ma być indeksowana
 * @param {string} props.ogImage - URL do niestandardowego obrazu Open Graph
 */
export const Seo = ({
  title,
  description = defaultMeta.description,
  canonical = defaultMeta.canonical,
  openGraph = {},
  twitter = {},
  noIndex = false,
  ogImage,
}) => {
  // Przygotowanie tytułu strony
  const pageTitle = title ? `${title} | Game Finder` : defaultMeta.title;

  // Przygotowanie danych Open Graph
  const ogData = {
    ...defaultMeta.openGraph,
    ...openGraph,
    url: canonical,
    title: pageTitle,
    description,
  };

  // Dodanie niestandardowego obrazu OG jeśli został podany
  if (ogImage) {
    ogData.images = [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title || defaultMeta.title,
      },
    ];
  }

  // Przygotowanie danych Twitter
  const twitterData = {
    ...defaultMeta.twitter,
    ...twitter,
  };

  return (
    <Helmet>
      {/* Podstawowe meta tagi */}
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Indeksowanie */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogData.type} />
      <meta property="og:url" content={ogData.url} />
      <meta property="og:title" content={ogData.title} />
      <meta property="og:description" content={ogData.description} />
      <meta property="og:site_name" content={ogData.site_name} />
      <meta property="og:locale" content={ogData.locale} />

      {ogData.images?.[0] && (
        <>
          <meta property="og:image" content={ogData.images[0].url} />
          <meta
            property="og:image:width"
            content={ogData.images[0].width.toString()}
          />
          <meta
            property="og:image:height"
            content={ogData.images[0].height.toString()}
          />
          <meta property="og:image:alt" content={ogData.images[0].alt} />
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content={twitterData.cardType} />
      <meta name="twitter:site" content={twitterData.site} />
      <meta name="twitter:creator" content={twitterData.handle} />

      {/* Dodatkowe tagi */}
      <meta name="application-name" content="Game Finder" />
      <meta name="apple-mobile-web-app-title" content="Game Finder" />
      <meta name="theme-color" content="#111827" />
    </Helmet>
  );
};

export default Seo;
