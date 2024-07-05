$(document).ready(function() {
    $('#job_title').on('input', function() {
        var jobTitle = $(this).val();
        if (jobTitle.length > 1) {
            $.ajax({
                url: '/search',
                method: 'POST',
                data: { job_title: jobTitle },
                success: function(data) {
                    var resultsDiv = $('#results');
                    resultsDiv.empty();
                    
                    // Group salaries by corrected_job_titles
                    var groupedResults = {};
                    data.corrected_job_titles.forEach(function(title, index) {
                        if (!groupedResults[title]) {
                            groupedResults[title] = [];
                        }
                        groupedResults[title].push(data.salaries[index]);
                    });
                    
                    // Display results
                    Object.keys(groupedResults).forEach(function(title) {
                        var jobResults = groupedResults[title];
                        var container = $('<div class="job-results"></div>');
                        container.append('<h4>Results for ' + title + ':</h4>');
                        jobResults.forEach(function(item) {
                            container.append(
                                '<div class="result-item"><p><strong>' + item[0] + '</strong> - ' + item[1] + ' ' + item[2] + '</p></div>'
                            );
                        });
                        resultsDiv.append(container);
                    });
                    
                    if (Object.keys(groupedResults).length === 0) {
                        resultsDiv.append(
                            '<div class="alert alert-warning">No data found for the given job title.</div>'
                        );
                    }
                }
            });
        } else {
            $('#results').empty();
        }
    });

    $('#search-form').on('submit', function(event) {
        event.preventDefault();
        var jobTitle = $('#job_title').val();
        $.ajax({
            url: '/search',
            method: 'POST',
            data: { job_title: jobTitle },
            success: function(data) {
                var resultsDiv = $('#results');
                resultsDiv.empty();
                
                // Group salaries by corrected_job_titles
                var groupedResults = {};
                data.corrected_job_titles.forEach(function(title, index) {
                    if (!groupedResults[title]) {
                        groupedResults[title] = [];
                    }
                    groupedResults[title].push(data.salaries[index]);
                });
                
                // Display results
                Object.keys(groupedResults).forEach(function(title) {
                    var jobResults = groupedResults[title];
                    var container = $('<div class="job-results"></div>');
                    container.append('<h4>Results for ' + title + ':</h4>');
                    jobResults.forEach(function(item) {
                        container.append(
                            '<div class="result-item"><p><strong>' + item[0] + '</strong> - ' + item[1] + ' ' + item[2] + '</p></div>'
                        );
                    });
                    resultsDiv.append(container);
                });
                
                if (Object.keys(groupedResults).length === 0) {
                    resultsDiv.append(
                        '<div class="alert alert-warning">No data found for the given job title.</div>'
                    );
                }
            }
        });
    });
});
