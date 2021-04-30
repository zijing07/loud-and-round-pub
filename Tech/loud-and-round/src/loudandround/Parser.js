import { Readability } from "@mozilla/readability";
import { API, graphqlOperation } from "aws-amplify";
import { useState } from "react";
import { Button, Container, Form, Grid, Header, TextArea } from "semantic-ui-react";
import { createArticle } from "../graphql/mutations";
import { STATUS_LOADING, STATUS_NONE, STATUS_SUCCESS } from "./common";

export const Parser = () => {
  const [org, setOrg] = useState('');
  const [parsed, setParsed] = useState('');
  const [finalHTML, setFinalHTML] = useState('');

  const [status, setStatus] = useState(STATUS_NONE);

  const createArticleApi = async () => {
    try {
      const article = {
        title: parsed.title,
        htmlBody: finalHTML,
        textBody: parsed.textContent,
        byline: parsed.byline,
        excerpt: parsed.excerpt
      };
      console.log(article);
      setStatus(STATUS_LOADING);
      await API.graphql(graphqlOperation(createArticle, {input: article}));
      setStatus(STATUS_SUCCESS);
    } catch (error) {
      setStatus(JSON.stringify(error));
    }
  }

  const formatXml = (xml, tab) => { // tab = optional indent value, default is tab (\t)
    var formatted = '', indent= '';
    tab = tab || '\t';
    xml.split(/>\s*</).forEach(function(node) {
        if (node.match( /^\/\w/ )) indent = indent.substring(tab.length); // decrease indent by one 'tab'
        formatted += indent + '<' + node + '>\r\n';
        if (node.match( /^<?\w[^>]*[^\/]$/ )) indent += tab;              // increase indent
    });
    return formatted.substring(1, formatted.length-3);
  }

  const renderFinalHTML = (finalHTML) => {
    setFinalHTML(formatXml(finalHTML));
    const div = document.createElement("div");
    div.innerHTML = finalHTML;
    const elem = document.getElementById('briefContent');
    elem.innerHTML = '';
    elem.appendChild(div);
  }

  const readify = () => {
    const doc = document.getElementById('renderFrame').contentWindow.document;
    try {
      const parsed = new Readability(doc).parse();
      setParsed(parsed);
      renderFinalHTML(parsed.content);
    } catch (error) {
      setParsed(error.message);
    }
  }

  return (
    <Container as="main">
      <Header as="h1">Parser</Header>
      <Container>
        <Form>
        <TextArea 
          placeholder="Original HTML" 
          onChange={(event, data) => setOrg(data.value)}
          value={org}/>
        </Form>
      </Container>
      <p/>
      <Button primary onClick={readify}>Convert</Button>
      <p/>
      <Container>
        <Header as="h4">Converted:</Header>
        <Header as="h4">{parsed.title}</Header>
        <Grid columns={2}>
          <Grid.Column>
            <Form>
              <TextArea 
                style={{height:`${(parsed.textContent && parsed.textContent.split(" ").length) || 200}px`}}
                placeholder="Readified HTML String" 
                value={finalHTML}
                onChange={(event, data) => renderFinalHTML(data.value)}/>
              <p/>
            </Form>
            <p/>
            <Button primary disabled={status === STATUS_LOADING} onClick={createArticleApi}>
              Add Article
            </Button>
            <p>Status: {status}</p>
          </Grid.Column>
          <Grid.Column>
            <div id="briefContent"></div>
          </Grid.Column>
        </Grid>

      </Container>
      <iframe srcDoc={org} id="renderFrame" height="1px" title='tmp'/>
    </Container>
  )
} 