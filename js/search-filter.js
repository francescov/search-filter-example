/****
 *	NYC HPD Housing Connect Search Filter
 *	Requires NYC.gov Responsive Templates
 *	http://www1.nyc.gov/site/hpd/renters/housing-connect-opportunities.page
 *
 **/

/****
 * Columns - Structure Last updated 12/1/17
 * Project Title [0]
 * Project Link [1]
 * Application Deadline [2]
 * Borough [3]
 * Household Size [4]
 * Income Levels Served [5]
 * Photo File Name [6]
 * Photo 2 [7]
 * Short Description [8]
 * Apply Text [9]
 * Apply Link [10]
 * Internal Counter [11]
 */

/**
 *	qs(value) - Query String Function Handler
 **/
window.qs=function(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var b="[\\?&]"+a+"=([^&#]*)";var c=new RegExp(b);var d=c.exec(window.location.href);if(d==null)return"";else return d[1]}

/***
 *	configureIt()
 *	Function that stores all globally available options
 *	required for the script to operate
 *
 **/ 
window.configureIt = function(){
	pageAttachment		= 'about-description';							//The object to attach the filter container to (Default: "about-description" for new template)
	filterContainer 	= 'hpd-housing-connect-container';				//The Container Object Name (Required)
	pagination_by 		= 100;											//Set the number of items per page (Default: 5)	
	paginateResults 	= 'both';										//Shows the Pagination Above or Below The Search Results = 'above','below','both' (Default:'both')
	showBackToTop 		= true;											//Show the "Back to Top" Link below the Results (Default: true)
}

/***
 *	generateForm()
 *	Function that dynamically populates the "reusable" form.
 **/
window.generateForm = function(){
	$('.'+filterContainer).addClass('row'); //Set the responsive row for the container

	//Add the accessibility aria-live="polite" to the container DIV
	$('.'+filterContainer).attr('aria-live','polite');
	
	//Generate the Two Dropdown Objects
	$('.'+filterContainer).append('<p><strong>You may filter current opportunities by borough, <a href="/assets/hpd/downloads/pdf/renter-resources/affordable-housing-income-eligibility.pdf">income level</a>, and/or household size to find the opportunities that you may be eligible for.</strong></p>');
	$('.'+filterContainer).append('<form id="hpdprojectsfilter" class="control-form">');
	$('#hpdprojectsfilter').append('<div class="row"><div class="container"><div class="span12 control-group"><label class="control-label">Borough: <select name="filter_borough" id="filter_borough"></select></label></div></div></div>');
	$('#hpdprojectsfilter').append('<div class="row"><div class="container"><div class="span12 control-group"><label class="control-label">Income Requirements: <select name="filter_incomereq" id="filter_incomereq"></select></label></div></div></div>');
	$('#hpdprojectsfilter').append('<div class="row"><div class="container"><div class="span12 control-group"><label class="control-label">Household Size: <select name="filter_householdsize" id="filter_householdsize"></select></label></div></div></div>');

	
	//Generate the dropdown values
	inputDropdowns(); 
	
	/* Collect the values and Generate the Submit Button */
	$('#hpdprojectsfilter').append('<div class="row"><div class="container"><div class="form-actions"><button type="button" id="searchBtn" class="btn btn-form-submit">Submit</button></div></div></div>');


	$('.'+filterContainer).append('<div class="row"><div class="container"><div class="span12 projects-statusbar" id="status"></div></div></div>'); //Status Bar Area
	if (paginateResults == 'above' || paginateResults == 'both') {
		$('.'+filterContainer).append('<div class="projects-pagination">'); //Pagination Above Results
	}
	$('.'+filterContainer).append('<div class="projects-search-results">'); //Search Results Area
	if (paginateResults == 'below' || paginateResults == 'both') {
		$('.'+filterContainer).append('<div class="projects-pagination">'); //Pagination Below Results
	}
	
	//Back to Top Link
	if(showBackToTop){
		$('.'+filterContainer).append('<div class="row projects-back-to-top"><div class="container"><div class="span12" align="right"><a href="#top">Back to Top</a></div></div></div>');
	}
	
}


/***
 *	inputDropdowns()
 *	Function to add the dropdown values.
 **/
window.inputDropdowns = function() {

	incomeReq = new Array();
		incomeReq[0] = 'Extremely Low-Income';
		incomeReq[1] = 'Very Low-Income';
		incomeReq[2] = 'Low-Income';
		incomeReq[3] = 'Moderate-Income';
		incomeReq[4] = 'Middle-Income';
	
	borough = new Array();
		borough[0] = 'Bronx';
		borough[1] = 'Brooklyn';
		borough[2] = 'Manhattan';
		borough[3] = 'Queens';
		borough[4] = 'Staten Island';
	
	householdsize = new Array();
		householdsize[0] = '1';
		householdsize[1] = '2';
		householdsize[2] = '3';
		householdsize[3] = '4';
		householdsize[4] = '5';
		householdsize[5] = '6';
		householdsize[6] = '7';
		householdsize[7] = '8';



	//Loop through and add each value to borough dropdown.
	$('#filter_borough').append('<option value="">-Select a Borough-</option>');
	for (i=0;i<borough.length;i++){$('#filter_borough').append('<option value="'+borough[i]+'">'+borough[i]+'</option>');}
		
	//Loop through and add each value to income requirement dropdown.
	$('#filter_incomereq').append('<option value="">-Select an Income Requirement -</option>');
	for (i=0;i<incomeReq.length;i++){$('#filter_incomereq').append('<option value="'+incomeReq[i]+'">'+incomeReq[i]+'</option>');}

	//Loop through and add each value to household size dropdown.
	$('#filter_householdsize').append('<option value="">-Select Your Household Size -</option>');
	for (i=0;i<householdsize.length;i++){$('#filter_householdsize').append('<option value="'+householdsize[i]+'">'+householdsize[i]+'</option>');}

}

/***
 *	processResults(item,item)
 *	Function that processes the results by passing corresponding values from the dropdowns.
 **/

window.processResults = function(borough,incomeReq,householdsize){
	//Declare boolean variables and temporary storage array
	var borough_found, incomeReq_found, householdsize_found;
	inclusive_search = new Array();

	
	for (i=0;i<housingconnect.length;i++) {
		/* borough (3), income requirement (5), household size (4) */
		if (borough != '') {
			$('#status').append(' <strong>'+borough+'</strong>, ');
			if ( housingconnect[i][3].toLowerCase().indexOf(borough.toLowerCase())!=-1 ) {
				borough_found=true;
			} else {
				borough_found=false;
			}
		} else {
			borough_found=true;
		}
		if (incomeReq != '') {
			$('#status').append(' <strong>'+incomeReq+'</strong>, ');
			if ( housingconnect[i][5].toLowerCase().indexOf(incomeReq.toLowerCase())!=-1 ) {
				incomeReq_found=true;
			} else {
				incomeReq_found=false;
			}
		} else {
			incomeReq_found=true;
		}

		if (householdsize != '') {
			$('#status').append(' <strong>Household Size: '+householdsize+'</strong>, ');
			if ( housingconnect[i][4].indexOf(householdsize)!=-1 ) {
				householdsize_found=true;
			} else {
				householdsize_found=false;
			}
		} else {
			householdsize_found=true;
		}
		//Push the contents into the array when true
		if (borough_found && incomeReq_found && householdsize_found)
		{ 
			inclusive_search.push(housingconnect[i]);
		}
	}

	$('.projects-back-to-top').show();
	if(inclusive_search.length != 0){
		//Only show the pagination if inclusive search is larger than the pagination amount
		if (inclusive_search.length < pagination_by) {
			$('.projects-pagination').hide();
			$('.projects-pagination').html('');
		} else {
			$('.projects-pagination').show();
			$('.projects-pagination').html('');
						
			//Build the Pagination Button Set
			var pagNum = Math.round((inclusive_search.length+1)/pagination_by);	//Determine number of page buttons			
			for (i=0;i<pagNum;i++){
				if(i==0){
					$('.projects-pagination').append('<div class="projects-paginate_button" onclick="getPage('+(i+0)+','+pagination_by+');">'+(i+1)+'</div>');	
				}else{					
					$('.projects-pagination').append('<div class="projects-paginate_button" onclick="getPage('+((pagination_by*i))+','+(pagination_by)+');">'+(i+1)+'</div>');
				}
			}	
		}
		
		$('#status').attr('style','color:#000;text-align:left;');
		$('#status').html('Found <strong>'+inclusive_search.length+'</strong> result(s): ');
		if(borough){$('#status').append('<strong class="projects-status-items">'+borough+'</strong>');}
		if(incomeReq){$('#status').append('<strong class="projects-status-items">'+incomeReq+'</strong>');}
				
		$('.projects-search-results').html('');
				
		//If Result Set is less than the defined pagination amount, just show it all (default)
		if (inclusive_search.length<pagination_by) {
			$('.projects-search-results').append('<div class="row"><div class="container search-row"></div></div>');
			for (i=0;i<inclusive_search.length;i++){
				displayData();
			}

		} else {
			//If the Result Set is greater, then start at beginning and stop at the pagination number
			//This is the starting search loop value starting at 0
			$('.projects-search-results').append('<div class="row"><div class="container search-row"></div></div>');
			for (i=0;i<=pagination_by-1;i++) {
				displayData();
			}

			
		}	
	} else {
		$('#status').attr('style','display:block;color:#ff0000;font-size:16px;text-align:center;font-weight:bold;');
		$('#status').html('There are no results for the combination specified above.');
		$('.projects-search-results').html('');
		$('.projects-pagination').hide();
		$('.projects-pagination').html('');
	}	
}

/***
 *	getPage(x,y)
 *	Pagination Page Changer Function
 *
 **/
window.getPage = function(pgnum,pagination){
	$('.projects-search-results').html(''); //RESET DISPLAY FOR EACH PAGE
	$('.projects-search-results').append('<div class="row"><div class="container"><div class="span12 search-row">');
	for (i=(pgnum);i<=((pgnum+pagination)-1);i++) {
		displayData();
	}
}



/**
 *	displayData()
 *	Generate the HTML from the row data.
 *	Create a 3 by 3 row in accordance with the Bootstrap framework.
 *
 */


window.displayData = function() {
	
	$('.search-row').append('<div class="projects-flex-result" id="search_result_'+i+'">');
	$('#search_result_'+i).append('<div class="projects-search-bordering">');

	var dataImageFile = inclusive_search[i][6];		//Primary Image File (6)
	var dataRecordIndexNum = inclusive_search[i][11];	//Index Value of Original Array (11)
	var dataProjectTitle = inclusive_search[i][0];		//Project Title (0)

	//Image is required to be added on column #11 otherwise image path is not found and empty
	$('#search_result_'+i+' .projects-search-bordering').append('<a href="housingconnect-detail.page?recordID='+dataRecordIndexNum+'"><img src="'+dataImageFile+'" alt="Image of '+dataProjectTitle+'" title="'+dataProjectTitle+'" /></a>');
	$('#search_result_'+i+' .projects-search-bordering').append('<p class="projects-search-item-line"><a href="housingconnect-detail.page?recordID='+dataRecordIndexNum+'" title="'+dataProjectTitle+'"><strong>'+dataProjectTitle+'</strong></a></p>');
}



/***
 *	processQueryStrings()
 *	Requires global qs('name') function above;
 *	Reads query strings coming from external form (home page)
 *
 **/
window.processQueryStrings = function() {
	var boroughVal = qs('borough');
	var incomeReqVal = qs('income');
	var submitForm = qs('submitForm');
	
	if ( submitForm && (boroughVal || devProgramVal) ) {
		$('#filter_borough').val(boroughVal);
		$('#filter_incomereq').val(incomeReqVal);
		processResults(boroughVal,incomeReqVal);	
	}
}


/***
 *	Startup function to initialize the script
 *	
 **/

$(document).ready(function(){
	configureIt();		//Start up all configuration options
	$('.'+pageAttachment).append('<div class="'+filterContainer+'">'); //Create the container object
	generateForm();		//Generates the form in the dynamically created container object
	processQueryStrings();
	
	$('#searchBtn').on('click',function() {
		var boroughValue = $('#filter_borough').val();
		var incomeReqValue = $('#filter_incomereq').val();
		var householdsize = $('#filter_householdsize').val();
		//mediumValue sends a comma-separated string to the process function
		processResults(boroughValue,incomeReqValue,householdsize);
	});
	
});
