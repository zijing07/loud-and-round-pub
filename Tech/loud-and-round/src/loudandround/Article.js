import { API, graphqlOperation } from "aws-amplify";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Container, Divider, Header, Loader } from "semantic-ui-react";
import { getArticle } from "../graphql/queries";
import { STATUS_LOADING, STATUS_NONE, STATUS_SUCCESS } from "./common";

// Average length of English words: 4.7 characters
// Cut section for every 1000 words
// Plus the count of tags "<p>...</p>"
const SECTION_MAX = 6000;

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const Article = () => {
  const [article, setArticle] = useState('');
  const [status, setStatus] = useState(STATUS_NONE);

  const { id } = useParams();
  const query = useQuery();
  const sectionInQuery = query.get('section') || 'section-1';

  const addSection = (html) => {
    const length = html.length;
    const sectionCount = Math.round(length / SECTION_MAX);
    const sectionLength = Math.floor(html.length / sectionCount);

    // find the breaking positions
    const breakPos = [0];
    for (let i = 1; i < sectionCount; ++i) {
      let index = sectionLength * i;
      while (index < length - 1) {
        if (html[index] === '<' && html[index+1] !== '/') {
          breakPos.push(index);
          break;
        }
        index += 1;
      }
    }
    breakPos.push(length - 1);

    // break the whole article into #sectionCount parts
    const breakStr = [];
    for (let i = 0; i < breakPos.length - 1; ++i) {
      breakStr.push(html.substring(breakPos[i], breakPos[i+1]));
    }

    // add #Section and #Check-In
    const finalStr = breakStr.map((str, i) => 
      `<h3 class="ui olive header" id="section-${i+1}">Section ${i+1}</h3>` +
      str +
      `<h3 class="ui header"><a id="lnr-checkin-${i+1}" href="https://shorturl.at/cgGK4">打卡 Check-in</a></h3>` +
      `<div class="ui divider"></div>`
    );

    // piece the sections together
    return finalStr.reduce((prev, curr) => prev + curr);
  }

  useEffect(() => {
    const getArticleApi = async () => {
      try {
        setStatus(STATUS_LOADING);
        const art = await API.graphql(graphqlOperation(getArticle, { id }))
        setArticle(art.data.getArticle);
        document.title = `LoudAndRound - Daily Read`;
        setStatus(STATUS_SUCCESS);
      } catch (error) {
        setStatus(JSON.stringify(error));
      }
    }
    getArticleApi();
  }, [id]);

  const scrollPage = () => {
    const section = document.getElementById(sectionInQuery);
    if (section === null) return;
    section.scrollIntoView();
  }

  const addClassNameToImg = () => {
    const imgs = document.getElementsByTagName('img');
    const imgArr = Array.from(imgs);
    imgArr.forEach(img => img.classList.add("ui", "image"));
  }

  const disableLinks = () => {
    const linkTags = Array.from(document.getElementsByTagName('a'));
    linkTags
      .filter(tag => !tag.id.includes('lnr'))
      .forEach(tag => tag.removeAttribute('href'));
  }

  let renderBody = <div/>
  if (status === STATUS_LOADING) {
    renderBody = (<Loader active inline='centered'/>)
  } else if (status === STATUS_SUCCESS) {
    const div = document.getElementById('textBody');
    // const div = document.createElement('div');
    div.innerHTML = addSection(article.htmlBody);

    // Post operations
    // operations post appending HTML
    scrollPage();
    addClassNameToImg();
    disableLinks();

    renderBody = (
      <>
        <Header as='h1'>{article.title}</Header>
        <Header as='h3' disabled>{article.byline}</Header>
        <Divider />
      </>
    )
  } else {
    renderBody = (<p>{status}</p>)
  }

  return (
    <Container text>
      {renderBody}
      <div id='textBody'/>
    </Container>
  )
}