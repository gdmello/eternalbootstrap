// datedCheck = Date.parse('today');
function getCurrentPassionPrayer(datedCheck) {
	// string = 'Sun Mar 09 2014 22:00:14 GMT-0400 (EDT)';
	// var today = Date.parse('today');
	// today.setTimeToNow();
	console.log(datedCheck);
	var todayCopy = datedCheck.clone();
	var prayerHoursAscending = [datedCheck.clone().set({ hour: 0, minute: 0 }),
	datedCheck.clone().set({ hour: 0, minute: 45 }),
	datedCheck.clone().set({ hour: 1, minute: 30 }),
	datedCheck.clone().set({ hour: 2, minute: 15 }),
	datedCheck.clone().set({ hour: 3, minute: 0 }),
	datedCheck.clone().set({ hour: 3, minute: 45 }),
	datedCheck.clone().set({ hour: 4, minute: 30 }),
	datedCheck.clone().set({ hour: 5, minute: 15 }),
	datedCheck.clone().set({ hour: 6, minute: 0 }),
	datedCheck.clone().set({ hour: 6, minute: 45 }),
	datedCheck.clone().set({ hour: 7, minute: 30 }),
	datedCheck.clone().set({ hour: 8, minute: 15 }),
	datedCheck.clone().set({ hour: 9, minute: 0 }),
	datedCheck.clone().set({ hour: 9, minute: 45 }),
	datedCheck.clone().set({ hour: 10, minute: 30 }),
	datedCheck.clone().set({ hour: 11, minute: 15 }),
	datedCheck.clone().set({ hour: 12, minute: 0 }),
	datedCheck.clone().set({ hour: 12, minute: 45 }),
	datedCheck.clone().set({ hour: 13, minute: 30 }),
	datedCheck.clone().set({ hour: 14, minute: 15 }),
	datedCheck.clone().set({ hour: 15, minute: 0 }),
	datedCheck.clone().set({ hour: 15, minute: 45 }),
	datedCheck.clone().set({ hour: 16, minute: 30 }),
	datedCheck.clone().set({ hour: 17, minute: 15 }),
	datedCheck.clone().set({ hour: 18, minute: 0 }),
	datedCheck.clone().set({ hour: 18, minute: 30 }),
	datedCheck.clone().set({ hour: 19, minute: 0 }),
	datedCheck.clone().set({ hour: 19, minute: 30 }),
	datedCheck.clone().set({ hour: 20, minute: 0 }),
	datedCheck.clone().set({ hour: 20, minute: 30 }),
	datedCheck.clone().set({ hour: 21, minute: 0 }),
	datedCheck.clone().set({ hour: 21, minute: 30 }),
	datedCheck.clone().set({ hour: 22, minute: 0 }),
	datedCheck.clone().set({ hour: 22, minute: 30 }),
	datedCheck.clone().set({ hour: 23, minute: 0 }),
	datedCheck.clone().set({ hour: 23, minute: 30 }),
	(datedCheck.clone().set({ hour: 0, minute: 0 }).addDays(1))];
	
	var hourlyPrayerToDisplay;
	for(var i=0; i<prayerHoursAscending.length; i++) {
		console.log('now '+todayCopy+ ' : hour prayer '+prayerHoursAscending[i]);
		if(Date.compare(todayCopy, prayerHoursAscending[i]) < 0 ) {
			var pageIndex = ((i-1) < 0)? 0: i-1;//A little trickiness around midnight.

			return 'passionOfJesusHourlyPrayer-'+prayerHoursAscending[pageIndex].toString("HH-mm")+'.html';
		}
	}

	return;
}

