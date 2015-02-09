function getCurrentPassionThorn(dateToCheck) {
	console.log("Date to check: " + dateToCheck);
	var todayCopy = dateToCheck.clone();
	var prayerHoursAscending = [
	[dateToCheck.clone().set({ hour: 0, minute: 0 }), 0],
	[dateToCheck.clone().set({ hour: 0, minute: 45 }), 1],
	[dateToCheck.clone().set({ hour: 1, minute: 30 }), 2],
	[dateToCheck.clone().set({ hour: 2, minute: 15 }), 3],
	[dateToCheck.clone().set({ hour: 3, minute: 0 }), 4],
	[dateToCheck.clone().set({ hour: 3, minute: 45 }), 5],
	[dateToCheck.clone().set({ hour: 4, minute: 30 }), 6],
	[dateToCheck.clone().set({ hour: 5, minute: 15 }), 7],
	[dateToCheck.clone().set({ hour: 6, minute: 0 }), 8],
	[dateToCheck.clone().set({ hour: 6, minute: 45 }), 9],
	[dateToCheck.clone().set({ hour: 7, minute: 30 }), 10],
	[dateToCheck.clone().set({ hour: 8, minute: 15 }), 11],
	[dateToCheck.clone().set({ hour: 9, minute: 0 }), 12],
	[dateToCheck.clone().set({ hour: 9, minute: 45 }), 13],
	[dateToCheck.clone().set({ hour: 10, minute: 30 }), 14],
	[dateToCheck.clone().set({ hour: 11, minute: 15 }), 15],
	[dateToCheck.clone().set({ hour: 12, minute: 0 }), 16],
	[dateToCheck.clone().set({ hour: 12, minute: 45 }), 17],
	[dateToCheck.clone().set({ hour: 13, minute: 30 }), 18],
	[dateToCheck.clone().set({ hour: 14, minute: 15 }), 19],
	[dateToCheck.clone().set({ hour: 15, minute: 0 }), 20],
	[dateToCheck.clone().set({ hour: 15, minute: 45 }), 21],
	[dateToCheck.clone().set({ hour: 16, minute: 30 }), 22],
	[dateToCheck.clone().set({ hour: 17, minute: 15 }), 23],
	[dateToCheck.clone().set({ hour: 18, minute: 0 }), 24],
	[dateToCheck.clone().set({ hour: 18, minute: 30 }), 25],
	[dateToCheck.clone().set({ hour: 19, minute: 0 }), 26],
	[dateToCheck.clone().set({ hour: 19, minute: 30 }), 27],
	[dateToCheck.clone().set({ hour: 20, minute: 0 }), 28],
	[dateToCheck.clone().set({ hour: 20, minute: 30 }), 29],
	[dateToCheck.clone().set({ hour: 21, minute: 0 }), 30],
	[dateToCheck.clone().set({ hour: 21, minute: 30 }), 31],
	[dateToCheck.clone().set({ hour: 22, minute: 0 }), 32],
	[dateToCheck.clone().set({ hour: 22, minute: 30 }), 33],
	[dateToCheck.clone().set({ hour: 23, minute: 0 }), 34],
	[dateToCheck.clone().set({ hour: 23, minute: 30 }), 35],
	[(dateToCheck.clone().set({ hour: 0, minute: 0 }).addDays(1)), 0]];
	
	var hourlyPrayerToDisplay;
	for(var i=0; i<prayerHoursAscending.length; i++) {
		if(Date.compare(todayCopy, prayerHoursAscending[i][0]) < 0 ) {
			var pageIndex = ((i-1) < 0)? 0: i-1;//A little trickiness around midnight.
			return prayerHoursAscending[pageIndex];
		}
	}

	console.log("Unable to find passion prayer for current time, reverting to 12am prayer : " + dateToCheck);
	return prayerHoursAscending[pageIndex][1];
}

function getCurrentPassionSlideNumber(dateToCheck) {
	currentThorn = getCurrentPassionThorn(dateToCheck)
	return currentThorn[1]
}

function getCurrentPassionHourlyPrayerToDisplay(dateToCheck) {
	currentThorn = getCurrentPassionThorn(dateToCheck)
	return 'passionOfJesusHourlyPrayer-'+currentThorn[0].toString("HH-mm")+'.html';
}
