import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { graphql, compose } from "react-apollo";
import { bindActionCreators } from "redux";
import { push } from "react-router-redux";
import ArticlePreview from "./ArticlePreview";
import injectSheet from "react-jss";
import { DeleteSection } from "../mutations";
import { SectionQuery, TopLevelSectionsQuery } from "../queries";
import Loading from "./Loading";

const styles = {
  sectionsLink: {
    textDecoration: "none",
    color: "black",
    "&:visited": {
      textDecoration: "none"
    },
    "&:hover": {
      textDecoration: "underline",
      textDecorationColor: "black"
    }
  }
};

const Section = ({
  classes,
  mutate,
  pathname,
  push,
  data: { loading, sectionBySlug }
}) => {
  const handleClick = () => {
    mutate({
      variables: { id: sectionBySlug.id },
      refetchQueries: [
        {
          query: TopLevelSectionsQuery
        }
      ]
    })
      .then(() => {
        push("/sections");
      })
      .catch(err => {
        console.error(err);
      });
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <div>
      <h2>
        {sectionBySlug.name}
      </h2>
      <div className={classes.sectionsLink}>
        <h3>
          {" "}<Link to={`/sections`}> Top Level Sections </Link>
        </h3>
      </div>
      <button onClick={handleClick}> Delete </button>
      <ul>
        {sectionBySlug.parent_section &&
          <li>
            {" "}<Link to={`/sections/${sectionBySlug.parent_section.slug}`}>
              {" "}Back{" "}
            </Link>
          </li>}
        {sectionBySlug.subsections.map(subsection =>
          <li key={subsection.id}>
            {" "}<Link to={`${pathname}/${subsection.slug}`}>
              {" "}{subsection.name}{" "}
            </Link>
          </li>
        )}
      </ul>
      <div>
        {sectionBySlug.articles.map(article =>
          <ArticlePreview key={article.id} article={article} />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  pathname: state.router.location.pathname
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ push }, dispatch);
};

export default compose(
  graphql(DeleteSection),
  graphql(SectionQuery, {
    options: ({ slug }) => ({ variables: { slug } })
  }),
  injectSheet(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(Section);
