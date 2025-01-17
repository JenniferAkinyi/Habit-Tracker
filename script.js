const fetchHabits = async () => {
  try {
    const response = await fetch("http://localhost:3000/habits");
    const habitsData = await response.json();
    console.log(habitsData);
    displayHabits(habitsData);
  } catch (error) {
    console.log(error);
  }
};

const displayHabits = (data) => {
  const habitDisplay = document.querySelector("#habitDisplay");
  let output = "";
  data.forEach(({ name, image, description, id }) => {
    output += `
        <div class="habit">
            <img src="${image}" alt="${name}">
            <h3>${name}</h3>
            <p>${description}</p>
            <div class="action=buttons">
                <button class="view" data-id="${id}">View</button>
                <button class="delete" data-id="${id}">Delete</button>
                </div>        
            </div>
        </div>
        `;
  });
  habitDisplay.innerHTML = output;
  document.querySelectorAll(".view").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      const selectedItem = data.find((item) => item.id == id);

      if (selectedItem) {
        document.getElementById("popup-title").textContent = selectedItem.name;
        document.getElementById("popup-image").src = selectedItem.image;
        document.getElementById("popup-date").textContent = `Date: ${new Date(
            selectedItem.date
          ).toLocaleDateString()}`;
        const streak = calculateStreak(selectedItem.date);
        document.getElementById(
          "popup-streak"
        ).textContent = `Streak: ${streak} days`;
        viewPopup.style.display = "flex";
      }
    });
    const calculateStreak = (startDate) => {
        const start = new Date(startDate);
        const today = new Date();
        const diffTime = Math.abs(today - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
      };
      
  });
  const deleteButtons = document.querySelectorAll(".delete");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const itemId = event.target.dataset.id;
      showDeleteConfirmation(itemId);
    });
  });
};

const deleteConfirmationPopup = document.querySelector(
    "#delete-confirmation-popup"
  );
  const confirmDeleteButton = document.querySelector("#confirm-delete");
  const cancelDeleteButton = document.querySelector("#cancel-delete");
  let deleteItemId = null;
  
  const showDeleteConfirmation = (itemId) => {
    deleteItemId = itemId; 
    deleteConfirmationPopup.style.display = "flex";
  };
  
  confirmDeleteButton.onclick = () => {
    if (deleteItemId) {
      deleteItem(deleteItemId);
      deleteConfirmationPopup.style.display = "none";
      deleteItemId = null;
    }
  };
  
  cancelDeleteButton.onclick = () => {
    deleteConfirmationPopup.style.display = "none";
    deleteItemId = null; 
  };
 
  const deleteItem = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:3000/habits/${itemId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        console.log(`Habit with ID ${itemId} deleted successfully.`);
        fetchHabits(); 
      } else {
        console.error(`Failed to delete habit with ID ${itemId}.`);
      }
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

const popupForm = document.querySelector("#popup-form");
const addHabitButton = document.querySelector("#add-habit");
addHabitButton.addEventListener("click", () => {
  popupForm.style.display = "flex";
});
const addHabitPopup = document.querySelector("#popup-form");
const closeAddHabitPopup = document.getElementById("close-popup");
closeAddHabitPopup.addEventListener("click", () => {
  popupForm.style.display = "none";
});
const habitForm = document.getElementById("dataForm");
habitForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const image = document.getElementById("imageUrl").value;
  const date = document.getElementById("date").value;
  const habit = { name, description, image, date};
  createHabit(habit);
  habitForm.reset();
  document.getElementById("popup-form").style.display = "none";
});
const createHabit = async (habit) => {
  try {
    const response = await fetch("http://localhost:3000/habits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(habit),
    });
    const newHabit = await response.json();
    console.log(newHabit);
    fetchHabits();
  } catch (error) {
    console.log(error);
  }
};
let viewPopup = document.querySelector("#view-popup");
let closeViewPopup = document.querySelector("#close-view-popup");
if (!closeViewPopup) {
  console.error("Close popup button not found!");
} else {
  closeViewPopup.addEventListener("click", () => {
    console.log("Close button clicked");
    viewPopup.style.display = "none";
  });
}
fetchHabits();
