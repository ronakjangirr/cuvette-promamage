import React, { useState } from 'react'
import styles from './Style.module.css';
import axios from 'axios';
import { baseUrl } from '../../apiConfig';

function DeleteTodo({ closeDeleteTodo, objectId, onDeleteSuccess, onDeleteUpdate }) {
  const handleConfirmDelete = async () => {
    try {
      // debugger
      // await axios.delete(`http://localhost:9090/api/todo/delete/${objectId}`);
      await axios.delete(`${baseUrl}api/todo/delete/${objectId}`);
      onDeleteSuccess();
      onDeleteUpdate()
      closeDeleteTodo(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelDelete = () => {
    closeDeleteTodo(false);
  };

  return (
    <>
      <div className={styles.backgroundOverlay}>
        <div className={styles.logoutPopup}>
          <p>Are you sure you want to Delete?</p>
          <div className={styles.buttonContainerThree}>
            <button className={styles.confirmButton} onClick={handleConfirmDelete}>
              Yes, Delete
            </button>
            <button className={styles.outlineButton} onClick={handleCancelDelete}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default DeleteTodo