import React, {useEffect, useState} from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

 const News =(props)=> {
   const [articles, setArticles] = useState([])
   const [loading, setLoading] = useState(true);
   const [page, setPage] = useState(1);
   const [totalResults, setTotalResults] = useState(0);
  
  const Capitalise = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const  updateNews = async()=> {
    props.setProgress(0);
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=dc2caeb502aa4f6db0c21e318b5f1e81&pageSize=${props.pageSize}`;
    setLoading(true)
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(parsedData.articles)
    setTotalResults(parsedData.totalResults)
    setLoading(false)
    props.setProgress(100);
  }

  useEffect(() =>{
    document.title = `${Capitalise(props.category)} - NewsMonkey`; 
    updateNews();
  },[])

  const fetchMoreData = async () => {
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=29d243b4765941ba9cbab2906320e598&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page + 1)
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(articles.concat(parsedData.articles))
    setTotalResults(parsedData.totalResults)
    setLoading(false)
  };

    return (
    <>
        <h1 className="text-center" style={{ margin: "35px 0px",marginTop: "90px" }}>
          NewsRoom - Top {Capitalise(props.category)} Headlines
        </h1>
         {loading && <Spinner/>} 
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner />}
        >
          <div className="container">
            <div className="row">
              {articles.map((element) => {
                return (
                  <div className="col-md-4" key={element.url}>
                    <NewsItem
                      source={element.source.name}
                      title={element.title ? element.title : " "}
                      description={
                        element.description ? element.description : " "
                      }
                      imageUrl={
                        element.urlToImage
                          ? element.urlToImage
                          : "https://cdn.pixabay.com/photo/2015/02/15/09/33/news-636978_960_720.jpg"
                      }
                      newsUrl={element.url}
                      author={element.author}
                      date={element.publishedAt}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </InfiniteScroll>
      </>
    );
}

News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
