import VerticalLayout from './VerticalLayout.js'

export default () => {

  return (`
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'> Envoyer une note de frais </div>
        </div>
        <div class="form-newbill-container content-inner">
          <form data-testid="form-new-bill">
            <div class="row">
                <div class="col-md-6">
                  <div class="col-half">
                    <label for="expense-type" class="bold-label">Type de dépense</label>
                      <select aria-label="type de depense" required class="form-control blue-border" data-testid="expense-type">
                        <option>Transports</option>
                        <option>Restaurants et bars</option>
                        <option>Hôtel et logement</option>
                        <option>Services en ligne</option>
                        <option>IT et électronique</option>
                        <option>Equipement et matériel</option>
                        <option>Fournitures de bureau</option>
                      </select>
                  </div>
                  <div class="col-half">
                    <label for="expense-name" class="bold-label">Nom de la dépense</label>
                    <input aria-label="nom de la depense" type="text" class="form-control blue-border" data-testid="expense-name" placeholder="Vol Paris Londres" />
                  </div>
                  <div class="col-half">
                    <label for="datepicker" class="bold-label">Date</label>
                    <input aria-label="date" required type="date" class="form-control blue-border" data-testid="datepicker" />
                  </div>
                  <div class="col-half">
                    <label for="amount" class="bold-label">Montant TTC </label>
                    <input aria-label="montant ttc" required type="number" class="form-control blue-border input-icon input-icon-right" data-testid="amount" placeholder="348"/>
                  </div>
                  <div class="col-half-row">
                    <div class="flex-col"> 
                      <label for="vat" class="bold-label">TVA</label>
                      <input aria-label="tva" type="number" class="form-control blue-border" data-testid="vat" placeholder="70" />
                    </div>
                    <div class="flex-col">
                      <label for="pct" class="white-text">%</label>
                      <input aria-label="%" required type="number" class="form-control blue-border" data-testid="pct" placeholder="20" />
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="col-half">
                    <label for="commentary" class="bold-label">Commentaire</label>
                    <textarea aria-label="commentaire" class="form-control blue-border" data-testid="commentary" rows="3"></textarea>
                  </div>
                  <div class="col-half">
                    <label for="file" class="bold-label">Justificatif</label>
                    <input aria-label="justification" required type="file" class="form-control blue-border" data-testid="file" />
                    <div><p id="error-msg" class="dp-none" data-testid="error" style="color: #e21313;">Veuillez changer le format de la photo.<br>Les formats pris en compte sont : JPG, JPEG, PNG</p></div>
                  </div>
                </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="col-half">
                  <button type="submit" id='btn-send-bill' class="btn btn-primary">Envoyer</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `)
}