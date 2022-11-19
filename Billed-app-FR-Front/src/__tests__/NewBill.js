/**
 * @jest-environment jsdom
 */

import { screen, waitFor, within, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import userEvent from "@testing-library/user-event";
import NewBill from "../containers/NewBill.js"
import user from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from '../__mocks__/store'
import Router from '../app/Router'
import router from "../app/Router.js";


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    beforeEach(() => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      Object.defineProperty(window, 'location', { value: { hash: ROUTES_PATH['NewBill'] } })
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
      document.body.innerHTML = `<div id="root"></div>`
      Router()
  })
  // Affichage titre NewBill
    test("Then NewBill page title should appear", () => {
      const html = NewBillUI({})
      document.body.innerHTML = html
      //to-do write assertion
      const contentTitle = screen.getAllByText('Envoyer une note de frais')
      expect(contentTitle).toBeTruthy
    })
    // Affichage de l'icone email
    test('Then mail icon in vertical layout should be highlighted', () => {
      const icon = screen.getByTestId('icon-mail')
      expect(icon.className).toBe('active-icon')
  })
  })
// Formulaire visible
  describe("When I'm on NewBill page", () => {
    test("Then it should show a form with valid inputs", () => {
      //1
      expect(screen.getByRole('combobox', {name: /type de depense/i})).toBeInTheDocument();
      //2
      expect(screen.getByRole("textbox", {name: /nom de la depense/i})).toBeInTheDocument();
      //3
      expect(screen.getByTestId('datepicker')).toBeInTheDocument();
      //4
      expect(screen.getByRole('spinbutton', {name: /montant ttc/i})).toBeInTheDocument();
      //5
      expect(screen.getByRole('spinbutton', {name: /tva/i})).toBeInTheDocument();
      //6
      expect(screen.getByRole('spinbutton', {name: /%/i})).toBeInTheDocument();
      //7
      expect(screen.getByRole('textbox', {name: /commentaire/i})).toBeInTheDocument();
      //8
      expect(screen.getByTestId('file')).toBeInTheDocument();
    })
  })
// Rester sur la meme page apres envoi du formulaire vide
  describe("When I do not fill fields and I click on submit button", () => {
    test("Then It should renders newBill page", () => {
      window.onNavigate(ROUTES_PATH.NewBill);
      const newBill = new NewBill({ document, onNavigate, mockStore, localStorage: window.localStorage });
      //1
      const dropdown = screen.getByRole('combobox', {
        name: /type de depense/i
      });
      expect(dropdown.value).toBe("Transports")
      //2
      const depenseType = screen.getByRole("textbox", {
        name: /nom de la depense/i
      });
      expect(depenseType.value).toBe("")
      //3
      const date = screen.getByTestId('datepicker')
      expect(date.value).toBe("")
      //4
      const montant = screen.getByRole('spinbutton', {
        name: /montant ttc/i
      })
      expect(montant.value).toBe("")
      //5
      const tva = screen.getByRole('spinbutton', {
        name: /tva/i
      })
      expect(tva.value).toBe("")
      //6
      const percentage = screen.getByRole('spinbutton', {
        name: /%/i
      })
      expect(percentage.value).toBe("")
      //7
      const comment = screen.getByRole('textbox', {
        name: /commentaire/i
      })
      expect(comment.value).toBe("")
      //8
      const file = screen.getByTestId('file')
      expect(file.value).toBe("")

      const form = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(handleSubmit).toHaveBeenCalled();
      expect(form).toBeTruthy();
    })
  })
// Creation du bill quand tous les champs sont bons
  describe("When all fields pass validation", () => {
    test("Then bill is created", async () => {
      window.onNavigate(ROUTES_PATH.NewBill);
      const newBill = new NewBill({ document, onNavigate, mockStore, localStorage: window.localStorage });
      // 1st
      const dropdown = screen.getByRole('combobox', {
        name: /type de depense/i
      });
      user.selectOptions(dropdown, within(dropdown).getByRole('option', {name: 'Transports'}));

      // 2nd
      const depenseType = screen.getByRole("textbox", {
        name: /nom de la depense/i
      });
      user.type(depenseType, 'Déjeuner');

      // 3rd
      const date = screen.getByTestId('datepicker')
      user.type(date, '27/08/2022')

      //4th
      const montant = screen.getByRole('spinbutton', {
        name: /montant ttc/i
      })
      user.type(montant, '348');

      //5th
      const tva = screen.getByRole('spinbutton', {
        name: /tva/i
      })
      user.type(tva, '70');

      //6th
      const percentage = screen.getByRole('spinbutton', {
        name: /%/i
      })
      user.type(percentage, '20');

      //7th
      const comment = screen.getByRole('textbox', {
        name: /commentaire/i
      })
      user.type(comment, 'Commentaire');

      //8th
      const file = new File(["img"], "image.png", { type: "image/png" });
      const inputFile = screen.getByTestId("file");
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      inputFile.addEventListener("change", handleChangeFile);
      userEvent.upload(inputFile, file);

      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
      const form = screen.getByTestId("form-new-bill");
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(handleSubmit).toHaveBeenCalled();
    })
  })
// Pas de message d'erreur si image = JPG / JPEG / PNG
  describe("When I upload an image who is JPG, JPEG, PNG", () => {
    test("Then there is no error message", async () => {
      document.body.innerHTML = NewBillUI();
      const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
      };
      const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage });
      const file = new File(["img"], "image.png", { type: "image/png" });
      const inputFile = screen.getByTestId("file");
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      const errorMsg = screen.getByTestId("error")
      inputFile.addEventListener("change", handleChangeFile);
      userEvent.upload(inputFile, file);
      expect(errorMsg).toBeInTheDocument();
      expect(handleChangeFile).toHaveBeenCalled();
      expect(inputFile.files[0]).toStrictEqual(file);
      expect(inputFile.files[0].name).toBe("image.png");
    })
  })
// Message d'erreur si image != JPG / JPEG / PNG
  describe("When I upload an image who is not JPG, JPEG, PNG", () => {
    test("Then an error message appear", async () => {
      document.body.innerHTML = NewBillUI({});
      const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
      };
      const newBill = new NewBill({ document, onNavigate, mockStore, localStorage: window.localStorage });
      const file = new File(["hello"], "hello.txt", { type: "document/txt" });
      const inputFile = screen.getByTestId("file");
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      inputFile.addEventListener("change", handleChangeFile);
      fireEvent.change(inputFile, { target: { files: [file] } });
      expect(handleChangeFile).toHaveBeenCalled();
      expect(inputFile.files[0].type).toBe("document/txt");
      await waitFor(() => screen.getByTestId("error"));
      expect(screen.getByTestId("error").classList).not.toContain("dp-none");
    })
  })
})

// POST

describe("Given I am connected as Employee on NewBill page, and submit the form", () => {
  beforeEach(() => {
    jest.spyOn(mockStore, "bills");

    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
        email: "a@a",
      })
    );
  });

  describe("When API is working well", () => {
    test("Then I should be redirect on Bills page with bills updated", async () => {
      const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorageMock });
      const form = screen.getByTestId('form-new-bill')
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
      form.addEventListener("submit", handleSubmit);

      fireEvent.submit(form);

      expect(handleSubmit).toHaveBeenCalled();
      expect(screen.getByText("Mes notes de frais")).toBeTruthy();
      expect(mockStore.bills).toHaveBeenCalled();
    });
  });

  describe("When an error occurs on API", () => {
    beforeEach(() => {
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
    })
    test("Then it should display a message error", async () => {
      console.error = jest.fn();
      window.onNavigate(ROUTES_PATH.NewBill);
      mockStore.bills.mockImplementationOnce(() => {
        return {
          update: () => {
            return Promise.reject(new Error("Erreur 404"));
          },
        };
      });

      const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage });
      const form = screen.getByTestId('form-new-bill')
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));

      form.addEventListener("submit", handleSubmit);

      fireEvent.submit(form);

      expect(handleSubmit).toHaveBeenCalled();

      await new Promise(process.nextTick);

      expect(console.error).toHaveBeenCalled();
    });
  });
});

