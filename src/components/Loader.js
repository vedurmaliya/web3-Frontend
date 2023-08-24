import React from 'react';
import PropTypes from 'prop-types';
import styles from './Loader.module.css';

const Loader = ({ isLoading }) => {
    return (
        <>
            {isLoading && (
                <div className={styles['loader-container']}>
                    <div className={styles.loader}>
                        <div className={styles.loader_square}></div>
                        <div className={styles.loader_square}></div>
                        <div className={styles.loader_square}></div>
                        <div className={styles.loader_square}></div>
                        <div className={styles.loader_square}></div>
                        <div className={styles.loader_square}></div>
                        <div className={styles.loader_square}></div>
                    </div>
                </div>
            )}
        </>
    );
};

Loader.propTypes = {
    isLoading: PropTypes.bool.isRequired,
};

export default Loader;
