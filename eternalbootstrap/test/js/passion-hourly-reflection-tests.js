test( "hello test", function() {
	datedCheck = Date.parse('today');
	datedCheck.setTimeToNow();
	alert('test' + getCurrentPassionPrayer(datedCheck));
    ok( 1 == "1", "Passed!" );
});