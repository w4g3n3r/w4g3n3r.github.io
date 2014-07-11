var gratitude = {

	calculate: function(totalDollars, startPercentage, endPercentage, parsers) {
		var $this = this;
		var totalCents = $this.getTotalCents(totalDollars);
		var startValue = $this.getPercentage(totalCents, startPercentage);
		var endValue = $this.getPercentage(totalCents, endPercentage);

		var results = [];

		var i,j;
		for (i = startValue, j = endValue; i < j; i++) {
			for (var p in parsers){
				if (parsers[p].validate(totalCents, i)) {
					results.push({
						total: $this.getTotalDollars(totalCents + i),
						tip: $this.getTotalDollars(i),
						tipPercent: Math.round((i / totalCents) * 100),
						parser: parsers[p].name,
						description: parsers[p].description
					});
				}
			}
		}

		return results;
	},

	getPercentage: function(totalCents, percentage) {
		return Math.round(totalCents * (percentage / 100))
	},

	getTotalCents: function(totalDollars) {
		return Math.round(totalDollars + 'e2');
	},

	getTotalDollars: function(totalCents) {
		return Number(totalCents + 'e-2');
	},

	parsers: {
		palindrome : {
			name: 'Palindrome',
			description: 'The number is the same backwards and forwards.',
			validate: function (totalCents, tipCents) {
				var total = (totalCents + tipCents).toString();
				if (total.length < 3) return false;

				return total == total.split('').reverse().join('');
			}
		},

		prime : {
			name: 'Prime Number',
			description: 'The amount is a prime number.',
			validate: function (totalCents, tipCents) {
				var total = (totalCents + tipCents).toString();
				return primes[total];
			}
		},

		repeat : {
			name: 'Repeating Number',
			description: 'The amount has a repeating pattern.',
			validate: function (totalCents, tipCents) {
				var total = (totalCents + tipCents).toString();

				var kernel = '';
				var i,j;
				for (i = 0, j = Math.round(total.length / 2); i < j; i++) {
					kernel += total[i];
					var pattern = '';
					while (pattern.length < total.length)
					{
						pattern += kernel;
					}
					if (pattern.substring(0, total.length) == total) return true;
				}
				return false;
			}
		}
	}
}