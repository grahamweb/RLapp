// Set up a object that will store all our global vars to limit the global namespace pollution.
var reputationLoop = {};
// Now setup any number of objects attached.
reputationLoop['mainPath'] = 'http://reputationloop.thegivinggeeks.com/';
reputationLoop['reviewsPerPage'] = 5;
reputationLoop['navLinksInbar'] = 5;
reputationLoop['pageOffset'] = 0;
reputationLoop['caller'] = '';
reputationLoop['pageNum'] = 1;
reputationLoop['targetContainerReviews'] = '';
reputationLoop['targetContainerBizInfo'] = '';
reputationLoop['misc'] = '';

$(document).ready(function() {
    // Now do the default page load var filling.
    // http://test.localfeedbackloop.com/api?apiKey=61067f81f8cf7e4a1f673cd230216112&noOfReviews=10&internal=1&yelp=1&google=1&offset=50
    if (window.document.getElementById("pageOffset")) {
        reputationLoop.pageOffset = $("#pageOffset").val();   
    }
    if (window.document.getElementById("reviewsPerPage")) {
        reputationLoop.reviewsPerPage = $("#reviewsPerPage").val();
    }
    getReviews();
    $("updateReviews").on("click", function(event){
        event.preventDefault();
        getReviews();    
    });
    $(".pagination").on("click", "li a", function(event){
        if (typeof $(this).attr("aria-label") !== "undefined" && $(this).attr("aria-label") != '') {
            // a next or prev button.
            if ($(this).attr("aria-label") == 'Previous') {
                //
                reputationLoop.pageOffset = reputationLoop.pageOffset - reputationLoop.navLinksInbar;
            } else {
                reputationLoop.pageOffset = reputationLoop.pageOffset + reputationLoop.navLinksInbar;
            }   
            if (reputationLoop.pageOffset < 1) {
                reputationLoop.pageOffset = 0;
                reputationLoop.pageNum = 1;    
            } else {
                reputationLoop.pageNum = Math.round(reputationLoop.pageOffset / reputationLoop.navLinksInbar);
            }
            
        } else {              
            // a page number button.
            reputationLoop.pageNum = $(this).text();
            reputationLoop.pageOffset = reputationLoop.navLinksInbar * reputationLoop.pageNum;
        }
        getReviews();
        remapNav();
    });
    $(".refresh").on("click", function(event){
        event.preventDefault();
        getReviews();
    });
    // Now load the page reviews in the holding container
});

function getReviews() {
    //
    reviewTypes = '';
    if ($("#googleReviews").prop( "checked" ) == true) {
        reviewTypes += "&google=1";
    }     
    if ($("#yelpReviews").prop( "checked" ) == true) {
        reviewTypes += "&yelp=1";
    }
    if ($("#internalReviews").prop( "checked" ) == true) {
        reviewTypes += "&internal=1";
    }
    // I use this so that we can load in multible view ports.
    // Seeing as this is just a demo page with one view port (I.E. you did not ask for comparion functions)
    reputationLoop.targetContainerReviews = $(".ajaxContent");
    reputationLoop.targetContainerBizInfo = $(".bizInfo");
    callData = "silent=true&queryAPI=" + encodeURI("http://test.localfeedbackloop.com/api?apiKey=61067f81f8cf7e4a1f673cd230216112") + "&noOfReviews=" + reputationLoop.reviewsPerPage + reviewTypes + "&offset="+reputationLoop.pageOffset+"&threshold=1";
    $.ajax({
        url: reputationLoop.mainPath,
        data: callData,
        dataType: "json",
    }).done(function(jsonData) {
        // empty holder
        formatedData = '';
        // update the business info with the new info, incase we are looping over more then one.
        RLUpdateBusinessInfo(jsonData.business_info);
        customerURL = jsonData.business_info.external_page_url;
        // Now loop over the JSON array and add each one to the results var
        for(i = 0; i < jsonData.reviews.length; i++) {
            formatedData += RLjsonToHTML(jsonData.reviews[i], customerURL);    
        } 
        // now add the new html to the DOM
        $(reputationLoop.targetContainerReviews).html("<div class='row'>" + formatedData + "</div>")
    });
}
function RLUpdateBusinessInfo(info) {
    // Fun fact! You use this to make optional parameters on javascript functions.
    // You don't see it often but it is real handy. 
    if (typeof info !== "undefined") {
        // Seeing as we are just error checking lets load the info.
        $(reputationLoop.targetContainerBizInfo).find(".business_name").text( info['business_name'] );
        $(reputationLoop.targetContainerBizInfo).find(".business_address").text( info['business_address'] );
        $(reputationLoop.targetContainerBizInfo).find(".business_phone").text( info['business_phone'] );
        $(reputationLoop.targetContainerBizInfo).find(".total_avg_rating").text( info['total_rating']['total_avg_rating'] );
        $(reputationLoop.targetContainerBizInfo).find(".total_no_of_reviews").text( info['total_rating']['total_no_of_reviews'] ); 
        $(reputationLoop.targetContainerBizInfo).find(".external_url").attr( 'href', info['external_url'] );
        $(reputationLoop.targetContainerBizInfo).find(".external_page_url").attr( 'href', info['external_page_url'] );
        
    } else {
        // If you were using for a optional parameter you would put a default value here. 
        // Oh snap... we should not be here, in production you could send info to a log handler to track this kind of error.
        // But for now I just want to show a friendly error.
        $(reputationLoop.targetContainerBizInfo).addClass('error').find(".errorMsg").text("Sorry, we seem to be having problems. It is likely just a temporary issue, please try again in a minute.");
    }      
}
function RLjsonToHTML(RLobject, customerURL) {
    // Take the data object and make formated HTML
    result = '<div class="col-sm-6 col-md-4">';
        result += '<div class="thumbnail">';
            result += '<a href="'+RLobject['customer_url']+'" class="thumbnail">';
                result += '<img src="http://placecreature.com/200/300" alt="We all love Kittens... Right?!">';
            result += '</a>';
            result += '<div class="caption">';
                result += '<h3 class="rated'+RLobject['rating']+'">Rating: <span class="rating">'+RLobject['rating']+'</span></h3>';
                result += '<p>';                                                                                                                       
                    result += '<span class="itemH"><span class="itemK">Reviewed On</span>'+RLobject['date_of_submission']+'</span>';
                    result += '<span class="itemH"><span class="itemK"></span>'+RLobject['customer_name']+' '+RLobject['customer_last_name']+'</span>';
                    result += '<span class="itemH"><span class="itemK">Source</span>'+RLobject['review_source']+'</span>';
                    result += '<span class="itemH desc">'+RLobject['description']+'</span>';
                    result += '<div class="clearAll">&nbsp;</div>';
                result += '</p>';
                result += '<p>';
                    result += '<a href="'+RLobject['customer_url']+'" class="btn btn-primary" role="button">User Profile</a>';
                    if (RLobject['review_url'] != '') {          
                        result += '<a href="'+RLobject['review_url']+'" data-reviewId="'+RLobject['review_id']+'" class="btn btn-default" role="button">Review Page</a>';
                    }
                result += '</p>';
            result += '</div>';
        result += '</div>';
    result += '</div>';
        
    return result;
}
function remapNav() {
    // Now lets make a new nav
    reputationLoop.misc = 1;
    console.log(reputationLoop.pageNum);
    minLinkNum = Math.round(reputationLoop.navLinksInbar / 2);
    if (reputationLoop.pageNum < minLinkNum) {
        reputationLoop.misc = 1;
    } else {
        reputationLoop.misc = reputationLoop.pageNum - Math.floor(reputationLoop.navLinksInbar / 2) 
    }
    // lets look at each <a> in the paganation bar and redo them
    $(".pagination").find("li a").each(function(){
        //
        if (typeof $(this).attr("aria-label") === "undefined") {
            $(this).text(reputationLoop.misc); 
            if (reputationLoop.misc == reputationLoop.pageNum) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
            reputationLoop.misc = reputationLoop.misc + 1;   
        }
    });
        
}