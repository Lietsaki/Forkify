export default class Likes{
    constructor(){
        this.likes = [];
    }

    addLike(id, title, author, img){
        const like = { id, title, author, img };
        this.likes.push(like);

        // Persist data in localStorage
        this.persistData();
        
        return like;
    }

    deleteLike(id){                                             // 1) Pass in an ID
        const index = this.likes.findIndex(el => el.id === id); // 2) Find the index of that ID in the likes array
        this.likes.splice(index, 1);                            // 3) Delete that item from the array using splice

        // Persist data in localStorage
        this.persistData();
        
    }

    isLiked(id){
        // Return true if the passed ID is found in the likes array, return false if it's not
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes(){
        return this.likes.length;
    }

    persistData(){
        // Turn the likes array into a string to be passed into the localStorage with JavaScript Object Notation(JSON)
        localStorage.setItem("likes", JSON.stringify(this.likes));
    }

    readStorage(){
        // Turn the likes string into an array of objects again
        const storage = JSON.parse(localStorage.getItem("likes"));

        // Restoring likes from the local storage
        if(storage) this.likes = storage; 
    }
}