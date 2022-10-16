import { createMemo, For, Show, Suspense } from "solid-js";
import { A, createRouteData, RouteDataArgs, useRouteData, useSearchParams } from "solid-start";
import Page from "~/components/Page";
import { useSession } from "~/session";
import { api } from "../realworlddemo"
import { formatDateString } from "../dates"
import { createServerData$ } from "solid-start/server";

type ArticleSource = 'feed' | 'global'

const articlesPerPage = 10

async function fetchArticleData(query) {
  const source: ArticleSource = query.source !== undefined && query.source === 'feed'
    ? 'feed'
    : 'global'

  const page: number = query.page === undefined
    ? 1
    : isNaN(parseInt(query.page))
      ? 1
      : Math.max(1, parseInt(query.page))

  const tag: string | null = source !== 'feed' && query.tag !== undefined
    ? query.tag
    : null

  const offset = (page - 1) * articlesPerPage

  console.log(`fetchArticleData(..): source = ${source}, page = ${page}, tag = ${tag}, offset = ${offset}`)

  const response =
    source === 'feed'
      ? await api.articles.getArticlesFeed({ limit: articlesPerPage, offset })
      : source === 'global' && tag === null
        ? await api.articles.getArticles({ limit: articlesPerPage, offset })
        : await api.articles.getArticles({ tag, limit: articlesPerPage, offset })
  return {
    articles: response.data.articles,
    articlesCount: response.data.articlesCount,
    source,
    page,
    tag
  };
}

async function fetchTags() {
  const response = await api.tags.tagsList()
  return response.data.tags;
}

export function routeData() {
  const [searchParams] = useSearchParams();

  const articleData = createRouteData(fetchArticleData, {
    key: () => {
      console.log(`routeData(): searchParams = ${JSON.stringify(searchParams)}`);
      return searchParams;
    }
  });

  const tags = createRouteData(fetchTags)

  return { articleData, tags }
}

export default function Home() {
  const { articleData, tags } = useRouteData<typeof routeData>();

  const articles = createMemo(() => articleData() ? articleData().articles : [])

  const source = createMemo(() => articleData() ? articleData().source : 'global')
  const page = createMemo(() => articleData() ? articleData().page : 1)
  const tag = createMemo(() => articleData() ? articleData().tag : null)

  const pageNums = createMemo(() => {
    const pageCount = articleData() ? Math.ceil(articleData().articlesCount / articlesPerPage) : 0
    return pageCount === 0 ? [] : [...Array(pageCount).keys()].map(i => i + 1)
  })

  const pageHref = (page: number) => {
    return source() === 'feed'
      ? `/?source=feed&page=${page}`
      : tag()
        ? `/?tag=${tag()}&page=${page}`
        : `/?page=${page}`
  }

  const session = useSession();

  return (
    <Page>
      <div class="home-page" >

        <div class="banner">
          <div class="container">
            <h1 class="logo-font">conduit</h1>
            <p>A place to share your knowledge.</p>
          </div>
        </div>

        <div class="container page">
          <div class="row">

            <div class="col-md-9">
              <div class="feed-toggle">
                <ul class="nav nav-pills outline-active">
                  <Show when={session.user()}>
                    <li class="nav-item">
                      <A class="nav-link disabled" href="/?source=feed">Your Feed</A>
                    </li>
                  </Show>
                  <li class="nav-item">
                    <A class="nav-link active" href="/">Global Feed</A>
                  </li>
                  <Show when={tag()}>
                    <li class="nav-item">
                      <A class="nav-link disabled" href={`/?tag=${tag()}`}>#{tag()}</A>
                    </li>
                  </Show>
                </ul>
              </div>

              <Suspense fallback={
                <p>Loading...</p>
              }>
                <For each={articles()}>
                  {(article) => {
                    return (
                      <div class="article-preview">
                        <div class="article-meta">
                          <A href={`/profile/${article.author.username}`}><img src={article.author.image} /></A>
                          <div class="info">
                            <A href={`/profile/${article.author.username}`} class="author">{article.author.username}</A>
                            <span class="date">{formatDateString(article.createdAt)}</span>
                          </div>
                          <button class="btn btn-outline-primary btn-sm pull-xs-right">
                            <i class="ion-heart"></i> {article.favoritesCount}
                          </button>
                        </div>
                        <A href={`/article/${article.slug}`} class="preview-link">
                          <h1>{article.title}</h1>
                          <p>{article.description}</p>
                          <span>Read more...</span>
                        </A>
                      </div>
                    )
                  }}
                </For>

                <nav>
                  <ul class="pagination">
                    <For each={pageNums()}>
                      {(pageNum) => (
                        <li classList={{
                          "page-item ng-scope": true,
                          "active": page() === pageNum
                        }} >
                          <A class="page-link" href={pageHref(pageNum)}>{pageNum}</A>
                        </li>
                      )}
                    </For>
                  </ul>
                </nav>
              </Suspense>
            </div>

            <div class="col-md-3">
              <div class="sidebar">
                <p>Popular Tags</p>

                <div class="tag-list">
                  <Suspense fallback={<p>Loading</p>}>
                    <For each={tags()}>
                      {(tag) => {
                        return (
                          <A href={`/?tag=${tag}`} class="tag-pill tag-default">{tag}</A>
                        )
                      }}
                    </For>
                  </Suspense>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </Page>
  );
}
