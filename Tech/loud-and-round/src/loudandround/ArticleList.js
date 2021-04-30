import { API, graphqlOperation } from "aws-amplify";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Header, Loader, Table } from "semantic-ui-react";
import { listArticles } from "../graphql/queries";
import { STATUS_LOADING, STATUS_NONE, STATUS_SUCCESS } from "./common";

export const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [status, setStatus] = useState(STATUS_NONE);

  useEffect(() => {
    const listArticlesApi = async () => {
      try {
        setStatus(STATUS_LOADING);
        const articles = await API.graphql(graphqlOperation(listArticles));
        setStatus(STATUS_SUCCESS);
        setArticles(articles.data.listArticles.items)
      } catch (error) {
        setStatus(error.message);
      }
    }
    listArticlesApi();
  }, [])

  let renderBody = (<div/>)

  // show loading
  if (status === STATUS_LOADING) {
    renderBody = (
      <Loader active inline='centered' />
    )
  } else if (status === STATUS_SUCCESS) {
    if (articles.length === 0) {
      renderBody = (
        <Header as='h4'>No record</Header>
      )
    } else {
      renderBody = (
        <Table basic='very' celled collapsing striped verticalAlign='top'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Created At</Table.HeaderCell>
            <Table.HeaderCell>Article</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        
        <Table.Body>
          { articles.map(article => (
          <Table.Row key={article.id}>
            <Table.Cell>
              <Header as='h4'>{article.createdAt}</Header>
            </Table.Cell>
            <Table.Cell>
              <Header as='h3'>
                <Link to={`/article/${article.id}`}>{article.title}</Link>
              </Header>
              <p>{article.byline}</p>
            </Table.Cell>
          </Table.Row>))}
        </Table.Body>
        </Table>
      )
    }
  } else {
    renderBody = (
      <Header as='h4' color='red'>{articles}</Header>
    )
  }

  // show list
  return (
    <Container>
      <Header as='h1'>Article List</Header>
      {renderBody}   
    </Container>
  )
}