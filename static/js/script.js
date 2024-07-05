$(document).ready(function() {
    // Événement déclenché lors de la saisie dans le champ #job_title
    $('#job_title').on('input', function() {
        var jobTitle = $(this).val();
        // Vérifie si la longueur du titre est supérieure à 1 caractère
        if (jobTitle.length > 1) {
            $.ajax({
                url: '/search', // URL de recherche
                method: 'POST', // Méthode de la requête
                data: { job_title: jobTitle }, // Données envoyées
                success: function(data) {
                    var resultsDiv = $('#results');
                    resultsDiv.empty(); // Vide les résultats précédents
                    
                    // Regroupage des résultats par poste
                    var groupedResults = {};
                    data.corrected_job_titles.forEach(function(title, index) {
                        if (!groupedResults[title]) {
                            groupedResults[title] = [];
                        }
                        groupedResults[title].push(data.salaries[index]);
                    });
                    
                    // Affichage des résultats regroupés
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
                    
                    // Si aucun résultat n'est trouvé
                    if (Object.keys(groupedResults).length === 0) {
                        resultsDiv.append(
                            '<div class="alert alert-warning">No data found for the given job title.</div>'
                        );
                    }
                },
                error: function() {
                    // Gestion des erreurs AJAX
                    var resultsDiv = $('#results');
                    resultsDiv.empty();
                    resultsDiv.append('<div class="alert alert-danger">Error occurred while fetching data.</div>');
                }
            });
        } else {
            $('#results').empty(); // Vide les résultats si le titre est trop court
        }
    });

    // Événement déclenché lors de la soumission du formulaire #search-form
    /*$('#search-form').on('submit', function(event) {
        event.preventDefault(); // Empêche la soumission traditionnelle du formulaire
        var jobTitle = $('#job_title').val();
        $.ajax({
            url: '/search', // URL de l'API de recherche
            method: 'POST', // Méthode de la requête
            data: { job_title: jobTitle }, // Données envoyées à l'API
            success: function(data) {
                var resultsDiv = $('#results');
                resultsDiv.empty(); // Vide les résultats précédents
                
                // Regroupage des salaires par poste
                var groupedResults = {};
                data.corrected_job_titles.forEach(function(title, index) {
                    if (!groupedResults[title]) {
                        groupedResults[title] = [];
                    }
                    groupedResults[title].push(data.salaries[index]);
                });
                
                // Affichage des résultats regroupés
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
                
                // Si aucun résultat n'est trouvé
                if (Object.keys(groupedResults).length === 0) {
                    resultsDiv.append(
                        '<div class="alert alert-warning">No data found for the given job title.</div>'
                    );
                }
            },
            error: function() {
                // Gestion des erreurs AJAX
                var resultsDiv = $('#results');
                resultsDiv.empty();
                resultsDiv.append('<div class="alert alert-danger">Error occurred while fetching data.</div>');
            }
        });
    });*/
});