
import React, { useState, useEffect} from 'react';
import BookmarkList from './ItemList';
import AddBookmark from './AddItemForm'
import StyledButton from '../UI/StyledButton'
import StyledSection from '../UI/StyledSection'

//should be able to pass in an component so you can have lists of different things?
const ListManager = ({ UID }) => {

    //NOTE: using a function to set inital value from localStorage
    const [bookmarks, setBookmarks] = useState(() => {
        const saved = localStorage.getItem(UID + "List");
        const initialValue = JSON.parse(saved);
        return initialValue || [];
    });

    useEffect(() => {
        localStorage.setItem(UID + "List", JSON.stringify(bookmarks));
    }, [UID, bookmarks]);

    const addBookmark = (bookmark) => {
        setBookmarks([...bookmarks, bookmark]);
    }

    // Use the created timestamp to match the bookmark and update it with the new one
    const editBookmark = (newBookmark) => {
        const updatedBookmarks = bookmarks.map((item) => {
            return (item.created === newBookmark.created) ? newBookmark : item
        })
        setBookmarks(updatedBookmarks);
    }

    const deleteBookmark = (bookmark) => {
        const updated = bookmarks.filter((item) => {
            //return everything except matched
            return (item.created !== bookmark.created)
        });
        setBookmarks(updated);
    }

    const deleteAllClick = () => {
        setBookmarks([]);
    }

    return (
        <StyledSection>
            <hr />
            <h1>{UID}</h1>
            <StyledButton onClick={deleteAllClick}>delete all</StyledButton>
            <AddBookmark addFunc={addBookmark} />
            <BookmarkList bookmarks={bookmarks} editFunc={editBookmark} deleteFunc={deleteBookmark} />
        </StyledSection>
    );
}

export default ListManager;
