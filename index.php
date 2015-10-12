<?php  
    // Set a default starting page.
    $pageNum = 1;
    if (isset($_REQUEST['pageNum'])) {
        // If the user entered a page number clean and save it.
        $pageNum = preg_replace('/[^0-9]/', '', $_REQUEST['pageNum']);
    }
    if (isset($_REQUEST['queryAPI'])) {
        // So that it can be changed to support more then one function.
        $url = preg_replace('/[^a-zA-Z0-9\&\?\=]/', '', urldecode( $_REQUEST['queryAPI']);
        // Now start checking the options we want to allow and clean and add as needed.
        if (isset($_REQUEST['noOfReviews'])) {
            $url .= '&noOfReviews='. preg_replace('/[^0-9]/', '', $_REQUEST['noOfReviews']);
        } else {
            $url .= '&noOfReviews=10';
        }      
        if (isset($_REQUEST['google']) && $_REQUEST['google'] == '1') {
            $url .= "&google=1";
        } else {
            $url .= "&google=0";
        }
        if (isset($_REQUEST['yelp']) && $_REQUEST['yelp'] == '1') {
            $url .= "&yelp=1";
        } else {
            $url .= "&yelp=0";
        }
        if (isset($_REQUEST['internal']) && $_REQUEST['yelp'] == '1') {
            $url .= "&internal=1";
        } else {
            $url .= "&internal=0";
        } 
        if (isset($_REQUEST['offset'])) {
            $url .= "&offset=".preg_replace('/[^0-9]/', '', $_REQUEST['offset']);
        } 
        if (isset($_REQUEST['threshold'])) {
            $url .= "&threshold=".preg_replace('/[^0-9]/', '', $_REQUEST['threshold']);
        }
        //die($url);  
        $RLObj = curl_init();  
        // set URL and other appropriate options.  
        curl_setopt($RLObj, CURLOPT_URL, $url);  
        curl_setopt($RLObj, CURLOPT_HEADER, 0);  
        curl_setopt($RLObj, CURLOPT_RETURNTRANSFER, true);  
        
        // Pass it to the caller.  
        $reviews = curl_exec($RLObj);  
        // House cleaning.
        curl_close($RLObj);
        // The 'silent' check is so that this can more reddilly support no JS browsing.
        if (isset($_REQUEST['silent']) && $_REQUEST['silent'] == 'true') {
            // Send it back.
            die($reviews);
        }
    }
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Reputation Loop</title>
    
        <meta charset="UTF-8">
    
        <link href="style.css" type="text/css" rel="stylesheet">
        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css">
        <link rel="stylesheet" href="style.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
        <script src="resources/script.js"></script>
    </head>
    
    <body>
        <div class="content">
            <div class="page-header">
                <h1>Reputation Loop <small>SPA Example</small></h1>
            </div>
            <div>
                <form>
                    <h2>Reviews to show</h2>
                    <label><span class="title">Google Reviews</span><input name="googleReviews" id="googleReviews" type="checkbox" checked="<?php if(!isset($_REQUEST['googleReviews']) || (isset($_REQUEST['googleReviews']) && $_REQUEST['googleReviews'] == '1')){ echo "checked"; } ?>" value="1" /></label>
                    <label><span class="title">Yelp Reviews</span><input name="yelpReviews" id="yelpReviews" type="checkbox" checked="<?php if(!isset($_REQUEST['yelpReviews']) || (isset($_REQUEST['yelpReviews']) && $_REQUEST['yelpReviews'] == '1')){ echo "checked"; } ?>" value="1" /></label>
                    <label><span class="title">Internal Reviews</span><input name="internalReviews" id="internalReviews" type="checkbox" checked="<?php if(!isset($_REQUEST['internalReviews']) || (isset($_REQUEST['internalReviews']) && $_REQUEST['internalReviews'] == '1')){ echo "checked"; } ?>" value="1" /></label>
                    <a href="#nogo"class="btn btn-default refresh" role="button">Refresh</a>
                </form>
            </div>
            <nav>
                <ul class="pagination">
                    <li>
                        <a href="#" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    <li><a href="#">1</a></li>
                    <li><a href="#">2</a></li>
                    <li><a href="#">3</a></li>
                    <li><a href="#">4</a></li>
                    <li><a href="#">5</a></li>
                    <li>
                        <a href="#" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
            </nav>
            <div class="panel panel-default">
                <div class="panel-heading bizInfo">
                    <h3 class="business_name">&nbsp;</h3>
                    <p>
                        <span class="businessInfoHolder"><span class="title">Phone</span><span class="business_phone"></span></span>
                        <span class="businessInfoHolder"><span class="title">Address</span><span class="business_address"></span></span>
                        <span class="businessInfoHolder"><span class="title">Avg rating of</span><span class="total_avg_rating"></span> with <span class="total_no_of_reviews"></span> Reviews</span>
                        <span class="businessInfoHolder"><span class="title">&nbsp;</span><a class="external_url" href="#nogo">Visit Oficial Website</a></span>
                        <span class="businessInfoHolder"><span class="title">&nbsp;</span><a class="external_page_url" href="#nogo">Visit Business Profile</a></span>
                    </p>
                    <div class="clearAll">&nbsp;</div>
                </div>
                <div class="panel-body ajaxContent">
                    <?php if (isset($reviews)) {
                        echo $reviews;
                    } ?>
                </div>
            </div>       
        </div>
    </body>
</html>