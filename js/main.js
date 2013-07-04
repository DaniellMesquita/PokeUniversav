
$(document).ready(function() {
	loadEvent();
});

function loadEvent() {
	var $container = $("#container");
	if(!supportsFileAPI()) {
		$container.html("<div id='error'>Your browser does not support HTML5's File API. Please update to a better browser.</div>");
	}
	else {
		// We support HTML5 File API so let's get cooking.
		var $fileIn = $("#fileInput");
		$fileIn.bind("change", loadFile);
		$("#inputLabel").bind("click", function() {
			$fileIn.click();
		})
	}
}

/**
 * Function that returns true if the user's web browser supports the HTML5 File API
 * @returns {boolean}
 */
function supportsFileAPI() {
	return window.File && window.FileReader && window.FileList && window.Blob;
}

/**
 * Ends with method for checking if a string ends with a bit of text
 * @param suffix
 * @returns {boolean}
 */
String.prototype.endsWith = function(suffix) {
	return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function error(msg) {
	$("#outputSection").html("<div id='error'>"+msg+"</div>");
}

function readFile(savefile) {
	var reader = new FileReader();

	reader.onload = (function(theFile) {
		return function(e) {
			$("#outputSection").html("<h2>"+ theFile.name +" loaded</h2>");
			var results = parseSav(e.target.result);
			if(results.checksum === 0) {
				error("Invalid save file provided. Is it a Generation I save file?");
			}
			else {
				console.log(results);
				var resultsContents = "<ul id='results'>"+
						"<li><b>Trainer Name:</b> " + results.trainerName + "</li>"+
						"<li><b>Trainer ID:</b> " + results.trainerID + "</li>"+
						"<li><b>Rival Name:</b> " + results.rivalName + "</li>"+
						"<li><b>Time Played:</b> " + results.timePlayed.hours +":"+ results.timePlayed.minutes + ":" + results.timePlayed.seconds + "</li>"+
						"<li><b>Checksum:</b> " + results.checksum + "</li>"
					;

				function addItemList(label, items) {
					resultsContents += "<li><b>"+label+": </b>";
					if(items.count > 0) {
						var html = "<ul>";
						for(var i = 0; i < items.count; i ++) {
							var item = items.items[i];
							html += "<li><b>"+item.name+"</b> x"+item.count+"</li>";
						}
						html +="</ul>";
						resultsContents += html;
					}
					resultsContents += "</li>";
				}

				addItemList("Pocket Items", results.pocketItemList);
				addItemList("PC Items", results.PCItemList);
				resultsContents += "</ul>";
				$("#outputSection").append(resultsContents);

			}
		};
	})(savefile);
	reader.readAsBinaryString(savefile);
}

function loadFile(evt) {
	evt = evt.originalEvent || evt;
	var savefile = evt.target.files[0];
	// save files are 32kb large and end in .sav
	if(savefile != null && savefile.size >= 32768 && savefile.name.endsWith(".sav")) {
		readFile(savefile);
	}
	else {
		error("Invalid save file provided. File size or extension is wrong.");
	}
}