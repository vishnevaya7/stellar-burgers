describe('Конструктор бургера', () => {
  beforeEach(() => {
    // Перехватываем запрос на получение ингредиентов
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients' }).as(
      'getIngredients'
    );

    // Перехватываем запрос на получение данных пользователя
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user' }).as('getUser');

    // Перехватываем запрос на создание заказа
    cy.intercept('POST', '**/api/orders', { fixture: 'order' }).as(
      'createOrder'
    );

    // Устанавливаем токены авторизации в localStorage
    window.localStorage.setItem('accessToken', 'test-access-token');
    window.localStorage.setItem('refreshToken', 'test-refresh-token');

    // Переходим на главную страницу
    cy.visit('/');

    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    // Очищаем localStorage после каждого теста
    window.localStorage.clear();
  });

  it('должен загружать и отображать ингредиенты', () => {
    // Проверяем, что ингредиенты загрузились и отображаются
    cy.get('[data-cy="ingredients-section"]').scrollIntoView().should('be.visible');

    // Проверяем наличие булок
    cy.get('[data-cy="bun-section"]').scrollIntoView().should('be.visible');
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa093c"]').should(
      'contain',
      'Краторная булка N-200i'
    );
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa093d"]').should(
      'contain',
      'Флюоресцентная булка R2-D3'
    );

    // Проверяем наличие начинок
    cy.get('[data-cy="main-section"]').scrollIntoView().should('be.visible');
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa0941"]').should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa0944"]').should(
      'contain',
      'Сыр с астероидной плесенью'
    );

    // Проверяем наличие соусов
    cy.get('[data-cy="sauce-section"]').scrollIntoView().should('be.visible');
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa0942"]').should(
      'contain',
      'Соус Spicy-X'
    );
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa0943"]').should(
      'contain',
      'Соус фирменный Space Sauce'
    );
  });

  it('должен открывать и закрывать модальное окно ингредиента', () => {
    // Кликаем на ингредиент для открытия модального окна
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa093c"]').click();

    // Проверяем, что модальное окно открылось
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="ingredient-details"]').should('be.visible');
    cy.get('[data-cy="ingredient-name"]').should(
      'contain',
      'Краторная булка N-200i'
    );

    // Проверяем URL
    cy.url().should('include', '/ingredients/643d69a5c3f7b9001cfa093c');

    // Закрываем модальное окно по клику на крестик
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
    cy.url().should('not.include', '/ingredients');
  });

  it('должен закрывать модальное окно по клику на оверлей', () => {
    // Открываем модальное окно
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa0942"]').click();
    cy.get('[data-cy="modal"]').should('be.visible');

    // Закрываем по клику на оверлей
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('должен добавлять булку в конструктор', () => {
    // Нажимаем "Добавить" у булки
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa093c"]').within(() => {
      cy.contains('button', 'Добавить').click();
    });

    // Проверяем, что булка добавилась
    cy.get('[data-cy="constructor-bun-top"]').should(
      'contain',
      'Краторная булка N-200i'
    );
    cy.get('[data-cy="constructor-bun-bottom"]').should(
      'contain',
      'Краторная булка N-200i'
    );

    // Проверяем счетчик булки
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa093c"]')
      .find('[data-cy="ingredient-count"]')
      .should('contain', '2');
  });

  it('должен добавлять начинки и соусы в конструктор', () => {
    // Добавляем начинку
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa0941"]').within(() => {
      cy.contains('button', 'Добавить').click();
    });

    // Проверяем, что начинка добавилась
    cy.get('[data-cy="constructor-ingredients"]').should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );

    // Проверяем счетчик начинки
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa0941"]')
      .find('[data-cy="ingredient-count"]')
      .should('contain', '1');

    // Добавляем соус
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa0942"]').within(() => {
      cy.contains('button', 'Добавить').click();
    });

    // Проверяем, что соус добавился
    cy.get('[data-cy="constructor-ingredients"]').should(
      'contain',
      'Соус Spicy-X'
    );

    // Проверяем счетчик соуса
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa0942"]')
      .find('[data-cy="ingredient-count"]')
      .should('contain', '1');
  });

  it('должен правильно рассчитывать стоимость заказа', () => {
    // Добавляем булку (1255 * 2 = 2510)
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa093c"]').within(() => {
      cy.contains('button', 'Добавить').click();
    });

    // Добавляем начинку (424)
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa0941"]').within(() => {
      cy.contains('button', 'Добавить').click();
    });

    // Добавляем соус (90)
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa0942"]').within(() => {
      cy.contains('button', 'Добавить').click();
    });

    // Проверяем общую стоимость (2510 + 424 + 90 = 3024)
    cy.get('[data-cy="constructor-price"]').should('contain', '3024');
  });

  it('должен создавать заказ для авторизованного пользователя', () => {
    // Собираем бургер
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa093c"]').within(() => {
      cy.contains('button', 'Добавить').click();
    });

    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa0941"]').within(() => {
      cy.contains('button', 'Добавить').click();
    });

    // Кликаем на кнопку "Оформить заказ"
    cy.get('[data-cy="order-button"]').click();

    // Ждем создания заказа
    cy.wait('@createOrder');

    // Проверяем, что модальное окно заказа открылось и номер заказа верный
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="order-details"]').should('be.visible');
    cy.get('[data-cy="order-number"]').should('contain', '12345');

    // Закрываем модальное окно
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');

    // Проверяем, что конструктор очистился
    cy.get('[data-cy="constructor-bun-top"]').should('not.exist');
    cy.get('[data-cy="constructor-ingredients"]').should(
      'not.contain',
      'Биокотлета из марсианской Магнолии'
    );

    // Проверяем, что счетчики обнулились
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa093c"]')
      .find('[data-cy="ingredient-count"]')
      .should('not.exist');
    cy.get('[data-cy="ingredient-643d69a5c3f7b9001cfa0941"]')
      .find('[data-cy="ingredient-count"]')
      .should('not.exist');
  });
});
