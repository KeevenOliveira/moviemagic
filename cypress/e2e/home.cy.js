describe("<Home/>", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("renders the Home component with trending and popular movies", () => {
    cy.wait(500);
    cy.contains("Trending").should("be.visible");
    cy.get('[data-testid="card-list"]').should("be.visible");

    cy.contains("Popular").should("be.visible");
    cy.contains("Movie Magic").should("be.visible");

    cy.get("svg").should("be.visible");
    cy.get('[data-testid="to-search"]').should("be.visible");
  });

  it("navigates to the Search page and return to home", () => {
    cy.get('[data-testid="to-search"]').click();
    cy.url().should("include", "/search");

    cy.wait(2000);

    cy.get('[data-testid="to-home"]').click();
    cy.url().should("include", "/");
  });

  it("navigates to the Movie page", () => {
    cy.get('[data-testid="card-list"]').first().click();
    cy.url().should("include", "/movie/");
  });

  it("navigate to search page and search for a movie", () => {
    cy.get('[data-testid="to-search"]').click();
    cy.url().should("include", "/search");

    cy.get('[data-testid="search-input"]').type("The Dark Knight");
    cy.get('[data-testid="search-button"]').click();

    cy.wait(2000);

    cy.get('[data-testid="card-list-pagination"]').should("be.visible");
    cy.get('[data-testid="card"]').first().click();
    cy.url().should("include", "/movie/");
  });
});
