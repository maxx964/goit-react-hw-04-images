import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar/SearchBar';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import { loadImages } from './api/api';

import styles from './App.module.css';

const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');

  useEffect(() => {
    getImages(query, page);
  }, [query, page]);

  const getImages = async (query, page) => {
    try {
      setIsLoading(true);
      const { images, totalImagesCount } = await loadImages(query, page);
      setImages((prevImages) => [...prevImages, ...images]);
      setLoadMore(page < Math.ceil(totalImagesCount / 12));
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  const handleImageSearch = (query) => {
    setQuery(query);
    setPage(1);
    setImages([]);
  };

  const loadMoreImages = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const openModal = (largeImageURL) => {
    setLargeImageURL(largeImageURL);
  };

  const closeModal = () => {
    setLargeImageURL('');
  };

  return (
    <div className={styles.App}>
      <SearchBar onSubmit={handleImageSearch} />
      <ImageGallery images={images} onImageClick={openModal} />
      {isLoading && images.length === 0 && <Loader />}
      {loadMore && <Button onClick={loadMoreImages} shouldShow={true} />}
      {largeImageURL && <Modal largeImageURL={largeImageURL} alt="Large Image" onClose={closeModal} />}
    </div>
  );
};

export default App;
