import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


  interface Ingredient {
    name: string;
    quantity: number;
    unit: string;
}

interface Instruction {
    description: string;
}

interface Recipe {
    title: string;
    ingredients: Ingredient[];
    instructions: Instruction[];
    image?: File;
}

let recipes: Recipe[] = [];
let editingIndex: number | null = null;

const recipeList = document.getElementById('recipeList') as HTMLElement;
const recipeModal = document.getElementById('recipeModal') as HTMLElement;
const modalTitle = document.getElementById('modalTitle') as HTMLElement;
const recipeTitleInput = document.getElementById('recipeTitle') as HTMLInputElement;
const recipeImageInput = document.getElementById('recipeImage') as HTMLInputElement;
const ingredientContainer = document.getElementById('ingredientContainer') as HTMLElement;
const instruction = document.getElementById('instruction') as HTMLElement;
const imageInput = document.getElementById('recipeImage') as HTMLInputElement;
const imagePreview = document.getElementById('imagePreview') as HTMLImageElement;
const h3 = document.getElementById('h3') as HTMLElement
const add = document.getElementById('add') as HTMLElement;
if (add) {
    add.onclick = (ev: MouseEvent) => {
        addIngredient();
    };
}
const addInst = document.getElementById('addInstruction') as HTMLElement;
if (addInst) {
    addInst.onclick = (ev: MouseEvent) => {
        addInstruction();
    };
}
const addRecipeButton = document.getElementById('addRecipeButton');
if (addRecipeButton) {
    addRecipeButton.onclick = (ev: MouseEvent) => {
        openModal();
    };
}
const recipe = document.getElementById('recipe');
if (recipe) {
    recipe.onclick = (ev: MouseEvent) => {
        openModal();
    };
}
document.getElementById('saveRecipeButton')!.onclick = saveRecipe;
document.getElementById('closeModalButton')!.onclick = closeModal;
// Добавить пункт рецепта
function addInstruction(description: string = '') {   
    const steps = document.createElement('li')
    steps.id = 'step'
    
    const desc = document.createElement('textarea');
    desc.id = 'description';
    desc.placeholder = 'Описание';
    desc.value = description;
    const deleteBtn = document.createElement('button');
    deleteBtn.id = 'del'
    deleteBtn.textContent = '×'
    deleteBtn.onclick = () => steps.remove();
    steps.appendChild(desc)
    steps.appendChild(deleteBtn)
    instruction.appendChild(steps)
}
// Добавить ингредиент
function addIngredient(name: string = '', quantity: number = 0, unit: string = '') {
    const ingredient = document.createElement('div');
    ingredient.id = 'ingredient';
    
    const nameIngredient = document.createElement('input');
    nameIngredient.type = 'text';
    nameIngredient.id = 'nameIngredient';
    nameIngredient.placeholder = 'Название ингредиента';
    nameIngredient.value = name;
    
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.id = 'quantity';
    quantityInput.step = '0.5';
    quantityInput.min = '0';
    quantityInput.placeholder = 'Кол-во';
    quantityInput.value = quantity.toString();
    
    const unitInput = document.createElement('input');
    unitInput.id = 'options';
    unitInput.placeholder = 'ед.изм';
    unitInput.name = 'inputOption';
        
    const dataList = document.createElement('datalist');
    dataList.id = 'ingredientOptions';
        
    const unitsArray: string[] = ["ч.л", "ст.л", "ст", "мл", "шт", "л"];
    unitsArray.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit;
        dataList.appendChild(option);
    });
    unitInput.setAttribute('list', 'ingredientOptions');
    unitInput.appendChild(dataList)
    unitInput.value = unit;

    const deleteButton = document.createElement('button');
    deleteButton.id = 'del'
    deleteButton.textContent = '×'
    deleteButton.onclick = () => ingredient.remove();
    ingredient.appendChild(nameIngredient);
    ingredient.appendChild(quantityInput);
    ingredient.appendChild(unitInput);
    ingredient.appendChild(deleteButton);
    ingredientContainer.appendChild(ingredient);
    }
// Окно для добавления/редактирования рецепта
function openModal(index?: number): void {
    recipeModal.style.display = 'flex';
    imageInput.style.display = 'flex';
    add.style.display = 'flex'
    addInst.style.display = 'flex'
    h3.style.display = 'flex'
    if (index !== undefined) {
        editingIndex = index;
        const recipe = recipes[index];
        recipeTitleInput.value = recipe.title;
        instruction.innerHTML = '';
        ingredientContainer.innerHTML = '';
        recipe.ingredients.forEach(ing => {
            addIngredient(ing.name, ing.quantity, ing.unit);
        });
        recipe.instructions.forEach(st => {
            addInstruction(st.description)
        });
        if (recipe.image) {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target?.result) {
                    imagePreview.src = e.target.result as string;
                    imagePreview.style.display = 'block';
                }
            };
            reader.readAsDataURL(recipe.image);
        }
        modalTitle.textContent = 'Редактировать Рецепт';
    } else {
        editingIndex = null;
        recipeTitleInput.value = '';
        imageInput.value = '';
        instruction.innerHTML = '';
        ingredientContainer.innerHTML = '';
        addIngredient();
        addInstruction();
        modalTitle.textContent = 'Добавить Рецепт';
    }
   
    imageInput.addEventListener('change', (event: Event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files ? target.files[0] : null;
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target?.result as string;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.style.display = 'none'; 
        }
    });
}
// Окно просмотра рецепта
function seeModal(index?: number | undefined): void {
    if (index !== undefined) {
        editingIndex = index;
        const recipe = recipes[index];
        recipeTitleInput.value = recipe.title;
        h3.style.display = 'none'
        imagePreview.style.display = 'none';
        ingredientContainer.innerHTML = '';
        instruction.innerHTML = '';
        recipe.ingredients.forEach(ing => {
            addIngredient(ing.name, ing.quantity, ing.unit);
        });
        recipe.instructions.forEach(st => {
            addInstruction(st.description)
        });
        if (recipe.image) {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target?.result) {
                    imagePreview.src = e.target.result as string;
                    imagePreview.style.display = 'block';
                }
            };
            reader.readAsDataURL(recipe.image);
        }
        modalTitle.textContent = '';
        recipeModal.style.display = 'flex';
        imageInput.style.display = 'none';
        add.style.display = 'none'
        addInst.style.display = 'none'
    } }
// Закрыть окно
function closeModal() {
    recipeModal.style.display = 'none';
    imageInput.value = '';
    imagePreview.style.display = 'none';
}
// Сохранить рецепт
function saveRecipe() {
    const title: string = recipeTitleInput.value;
    const imageFile: File | undefined = imageInput.files?.[0] || (editingIndex !== null ? recipes[editingIndex].image : undefined);
    const ingredients: Ingredient[] = Array.from(document.querySelectorAll('#ingredient')).map(block => ({
        name: (block.querySelector('#nameIngredient') as HTMLInputElement).value,
        quantity: parseFloat((block.querySelector('#quantity') as HTMLInputElement).value),
        unit: (block.querySelector('#options') as HTMLInputElement).value
    })).filter(ing => ing.name.trim() !== '');

    const instructions: Instruction[] = Array.from(document.querySelectorAll('#step')).map(item => ({
        description: (item.querySelector('#description') as HTMLInputElement).value
    })).filter(st => st.description !== '');

    if (editingIndex !== null) {
        recipes[editingIndex] = { title, ingredients, instructions, image: imageFile };
    } else {
        recipes.push({ title, ingredients, instructions, image: imageFile });
    }
    updateRecipeList();
    closeModal();
}
// Удалить рецепт
function deleteRecipe(index: number) {
    const confirmation = confirm("Вы уверены, что хотите удалить этот рецепт?");
    if (confirmation) {
          recipes.splice(index, 1);
          updateRecipeList();
    }
}

// Список рецептов
function updateRecipeList() {
  recipeList.innerHTML = '';
  recipes.forEach((recipe, index) => {
    const li = document.createElement('li');
    li.id = 'recipe'

    // Картинка рецепта
    const imageElement = document.createElement('img');
    imageElement.id = 'imgrecipe';
        if (recipe.image) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imageElement.src = e.target?.result as string; 
                imageElement.alt = recipe.title;
            };
            reader.readAsDataURL(recipe.image);
        }
    imageElement.onclick = () => seeModal(index);
    // Название
    const titleOfRecipe = document.createElement('b')
    titleOfRecipe.textContent = recipe.title
    titleOfRecipe.onclick = () => seeModal(index);
    // Дата
    const date = document.createElement('p')
    const now = new Date()
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); 
    const day = now.getDate().toString().padStart(2, '0');
    date.textContent = day.toString() + "." + month.toString() + "." + year.toString();

      // Кнопка редактирования
      const editButton = document.createElement('button');
      editButton.id = 'edit'
      editButton.textContent = 'Изменить';
      editButton.onclick = () => openModal(index);
      
      // Кнопка удаления
      const deleteButton = document.createElement('button');
      deleteButton.id = 'delete'
      deleteButton.textContent = '×';
      deleteButton.onclick = () => deleteRecipe(index);
      const div = document.createElement('div')
      div.id = 'box';
      const block = document.createElement('div')
      block.id = 'block';
      block.appendChild(editButton);
      block.appendChild(deleteButton);
      div.appendChild(titleOfRecipe)
      div.appendChild(date)
      li.appendChild(imageElement)
      li.appendChild(div)
      li.appendChild(block);
      recipeList.appendChild(li);
  });
}

