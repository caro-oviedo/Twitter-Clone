import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
const tweetsFromLocalStorage = JSON.parse(localStorage.getItem("tweetsLocalStorage"))
let tweetsToRender = tweetsFromLocalStorage || tweetsData 


document.addEventListener('click', e => {
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }  
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.replybutton){
        handleReplyBtnClick(e.target.dataset.replybutton)
    }
    else if(e.target.dataset.deletetweetbutton){
        handleDeleteBtnClick(e.target.dataset.deletetweetbutton)
    } 
 
})


 
function handleLikeClick(tweetId){ 
     const targetTweetObj = tweetsToRender.filter(tweet => tweet.uuid === tweetId)[0]
    
    targetTweetObj.isLiked ? targetTweetObj.likes-- : targetTweetObj.likes++
    targetTweetObj.isLiked = !targetTweetObj.isLiked 
    localStorage.setItem("tweetsLocalStorage", JSON.stringify(tweetsToRender))
    render()
    
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsToRender.filter(tweet => tweet.uuid === tweetId)[0]
    
    targetTweetObj.isRetweeted ? targetTweetObj.retweets-- : targetTweetObj.retweets++
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted   
    localStorage.setItem("tweetsLocalStorage", JSON.stringify(tweetsToRender))
    render() 
    
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    

    if(tweetInput.value){
        tweetsToRender.unshift({
        
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    localStorage.setItem("tweetsLocalStorage", JSON.stringify(tweetsToRender))
   
    render()
    tweetInput.value = ''
    }

}

function  handleReplyBtnClick(tweetId){
    const replyInput = document.getElementById(`textarea-${tweetId}`)

    if(replyInput.value){
           
        const targetTweetObj = tweetsToRender.filter(tweet => tweet.uuid === tweetId)[0]
           
        targetTweetObj.replies.unshift({
            handle: `@TrollBot66756542 💎`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: replyInput.value,
        })
        
      localStorage.setItem("tweetsLocalStorage", JSON.stringify(tweetsToRender))
        render()
        replyInput.value = ''
    }
   
}


function  handleDeleteBtnClick(tweetId){
   tweetsToRender = tweetsToRender.filter(tweet => tweetId !== tweet.uuid)
   
   localStorage.setItem("tweetsLocalStorage", JSON.stringify(tweetsToRender))
    render()
}   

/*******/ 
function getFeedHtml(){
    
    let feedHtml = ''
    tweetsToRender.forEach(tweet => {
    
        let likeIconClass = tweet.isLiked ? 'liked' : ''
        let retweetIconClass = tweet.isRetweeted ? 'retweeted' : ''
        let enableDeleteTweetClass = tweet.handle !== "@Scrimba" ?  'hidden' : ''
        
        let repliesHtml = ''
        if(tweet.replies.length > 0){
            
            tweet.replies.forEach(reply => {
                repliesHtml+=`
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${reply.handle}</p>
                                    <p class="tweet-text">${reply.tweetText}</p>
                                </div>
                            </div>
                    </div>
                    `
            })
        } /* end if replies.lenght */
           
        feedHtml+= `
            <div class="tweet">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-regular fa-comment-dots"
                                data-reply="${tweet.uuid}"
                                ></i>
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${likeIconClass}"
                                data-like="${tweet.uuid}"
                                ></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetIconClass}"
                                data-retweet="${tweet.uuid}"
                                ></i>
                                ${tweet.retweets}
                            </span>
                            <span class="tweet-detail ${enableDeleteTweetClass}">
                                <i class="fa-solid fa-trash delete-btn" data-deletetweetbutton="${tweet.uuid}"></i>
                            </span>
                            
                        </div>   
                    </div>            
                </div>
                
                <div class="hidden" id="replies-${tweet.uuid}">
                    <div class="reply-input-area">
                        <textarea class="reply-textarea" id="textarea-${tweet.uuid}" placeholder="Write comment"></textarea>
                        <i class="fa-solid fa-reply reply-btn" data-replybutton="${tweet.uuid}"></i>
                    </div>
                    
                    ${repliesHtml}
                </div>   
            </div>
            `  
    })   
    return feedHtml
    
} /* end function */
   

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
 
}

render()
