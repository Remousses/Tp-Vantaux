$(document).ready(function () {
    var reference = '', description = '', nbVantaux = '', nbTraverses = '';
    optionLength = $('#battue > option').length + 1;

    $('input[name="nbVantaux"]').on('click', function () {
        nbVantaux = $(this).val();
        nbTraverses = $('#nbTraverses').val();

        afficheImg(nbVantaux, nbTraverses);
        afficheLongueur(nbVantaux);
    });

    $('#nbTraverses').on('change', function () {
        nbVantaux = $('input[name="nbVantaux"]:checked').val();
        nbTraverses = $(this).val();

        afficheImg(nbVantaux, nbTraverses);
        afficheHauteur(nbTraverses);
    });

    $(".modal-content .close, .modal-content .btn-secondary").on('click', function() {
        $("#modalQRCode").toggle("explode");
    });

    $('#qrcode').on('click', function () {
        $('#erreurReference, #erreurDescription, #erreurNbTraverses, #erreurDimension, #erreurNum').empty();
        description = $('#description').val();
        nbVantaux = $('input[name="nbVantaux"]').val();
        nbTraverses = $('#nbTraverses').val();
        reference = $('#reference').val();

        (reference && description && nbVantaux && nbTraverses) ? qrCode(reference, description, nbVantaux, nbTraverses) : erreur(reference, description, nbTraverses);
    });
});

function afficheImg(nbVantaux, nbTraverses) {
    (nbVantaux && nbTraverses != 0) ? $('#img').attr('src', 'img/' + nbVantaux + nbTraverses + '.png') : $('#img').attr('src', 'img/Cemsas.gif');
}

function afficheLongueur(nbVantaux) {
    if (nbVantaux == 'GaucheDroit') {
        $('#lg, #ld, #battue').removeAttr('disabled');
    } else if (nbVantaux == 'Gauche') {
        $('#battue, #ld').attr('disabled', 'true');
        $('#lg').removeAttr('disabled');
    } else if (nbVantaux == 'Droit') {
        $('#battue, #lg').attr('disabled', 'true');
        $('#ld').removeAttr('disabled');
    }
}

function afficheHauteur(nbTraverses) {
    if (nbTraverses == '')
        $('#h1').attr('disabled', 'true');

    for (var i = 1; i <= optionLength; i++)
        $('#h' + i).attr('disabled', 'true');

    for (var i = 1; i <= nbTraverses; i++)
        $('#h' + i).removeAttr('disabled');
}

function qrCode(reference, description, nbVantaux, nbTraverses) {
    var dimension = '\n--- Dimension ---\n', lg = '', ld = '', erreur = '', erreurNum = '', arrayLargueur = ['Ld', 'Lg', 'Battue'], arrayHauteur = [];

    arrayLargueur.forEach(key => {
        if ($('#' + key.toLowerCase()).is(':enabled')) {
            if (!$('#' + key.toLowerCase()).val()) {
                erreur += ' - ' + key;
            } else {
                dimension += key + ' : ' + $('#' + key.toLowerCase()).val() + '\n';
            }
        }
    });
    
    for (let i = 1; i <= optionLength; i++) {
        const element = $('#h' + i), valInf = $('#h' + (i - 1)).val();
        
        if (element.val()) {
            arrayHauteur.push('H' + i);

            if (valInf){
                if (element.val() - valInf < 200)
                    erreurNum += 'erreur';
            }
        } else if (element.is(':enabled')) {
            erreur += ' - H' + i;
        }
    }

    if (erreur)
        $('#erreurDimension').append('Veuillez entrer des données pour : ' + erreur).css('color', 'red');
    if (erreurNum.indexOf('erreur') >= 0)
        $('#erreurNum').append('<br>Veuillez faire en sorte qu\'il y à 200 d\'écart entre chaque hauteur').css('color', 'red');

    arrayHauteur.forEach(key => {
        dimension += key + ' : ' + $('#' + key.toLowerCase()).val() + '\n';
    });

    if (!erreur && !erreurNum) {
        $('#modalBody').empty();
        $('#modalQRCode').modal({fadeDuration: 1000, fadeDelay: 0.50 });
        $('#modalBody').qrcode({text: ' Référence : ' + reference + '\n Description : ' + description +
        '\n Nombre de vantaux : ' + nbVantaux + '\n Nombre de traverses : ' + nbTraverses + '\n' + dimension});
    }
}

function erreur(reference, description, nbTraverses) {
    if(!reference)
        $('#erreurReference').text('Veuillez entrer une référence.').css('color', 'red');
    if(!description)
        $('#erreurDescription').text('Veuillez entrer une description.').css('color', 'red');
    if(!nbTraverses)
        $('#erreurNbTraverses').text('Veuillez choisir un nombre de traverses.').css('color', 'red');
}