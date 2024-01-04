# EMMA with Pet

## Overview and Purpose

EMMA is a project designed to accurately and objectively understand the balance of calories and nutrients related to exercise, diet, and daily life. It aims to provide users with effective support for body transformation, diet, health maintenance, bulking, cutting, and other goals.

### Key Objectives:

1. **Accurate Balance Assessment:** The project helps users accurately measure the balance between calorie intake and expenditure, providing insights into nutritional balance.

2. **Support for Body Transformation:** It offers support based on precise data for goals such as dieting, strength training, and health management.

3. **Virtual Pet Feature:** To enhance motivation, the project includes a virtual pet feature. The pet grows based on the user's recording habits, creating a bond with the user.

### Expected Use Cases:

- Users aiming for body transformation
- Users looking to lose weight through dieting
- Users focused on maintaining or improving their health
- Those in need of accurate recording of calorie intake and expenditure
- Users seeking motivation through the virtual pet feature

## System and Requirements:

- Python
- Django
- Javascript
- React (vite)
- Tailwind
- PostgreSQL

## Environment Setup:

### Environment Variables:
<!-- PostgreSQL -->
- export DB_USER
- export DB_PASSWORD
<!-- FatSecret -->
- export FOOD_API_CONSUMER_KEY
- export FOOD_API_CONSUMER_SECRET
<!-- Gmail -->
- export EMAIL_HOST_PASSWORD
<!-- React url -->
- export FRONTEND_ENDPOINT
<!-- Django -->
- export ALLOWED_HOSTS
- export DJANGO_SECRET_KEY

### Necessary Steps:
1. Navigate to `frontend/react-app-actual`
- npm i
- Install other dependencies (refer to package.json)
- npm run build
- Run

2. Configure PostgreSQL, set DB_NAME=emma

3. Create and activate venv

4. Navigate to `backend/django_project`
- Install Django
- Install other dependencies (refer to settings_common.py)
- Run migrations
- Start the server

## User Roles:

Users input Meal, Exercise, UserInfo, and Goal data. They can objectively review their dietary and exercise habits, aligned with their goals, using graphs and other visual aids. The project also includes a game element where users raise a virtual pet.

## Backend:
<hr>

## accounts 
### 1. Signup
- **Endpoint:** `/accounts/signup/`
- **Role:** Endpoint for users to create a new account.

### 2. Signup Email Confirm
- **Endpoint:** `/accounts/signup-confirmation`
- **Role:** Endpoint for users to confirm signup and activate their account. Requires passing uid and token.

### 3. Login
- **Endpoint:** `/accounts/login/`
- **Role:** Endpoint for users to log into their account using email (username) and password. Registers the user in the session and issues a token.

### 4. Logout
- **Endpoint:** `/accounts/logout/`
- **Role:** Endpoint for users to log out. Removes the user from the session and invalidates the token.

### 5. Password Reset Request
- **Endpoint:** `/accounts/reset-password-request/`
- **Role:** Endpoint for users to request a password reset.

### 6. Password Reset
- **Endpoint:** `/accounts/reset-password-confirm/`
- **Role:** Endpoint for users to reset their password. Requires passing uid, token, and new_password.

### 7. Get Account
- **Endpoint:** `/accounts/get/`
- **Role:** Endpoint for authenticated users to retrieve their account information.

### 8. Update Account
- **Endpoint:** `/accounts/update/`
- **Role:** Endpoint for authenticated users to update their account information.

### CustomUser Model
- Default Django user model that stores basic user information. Users with email_check=false cannot use the account.

### 
- * Authentication is required for functionalities; the login-issued token is passed from the frontend for user identification.

<hr>

## exercise
### 1. Get Workout
- **Endpoint:** `/exercise/get-workout/`
- **View:** `WorkoutListView`
- **Role:** Endpoint to get saved workout information, along with a list of default workouts.

### 2. Post Workout
- **Endpoint:** `/exrcise/post-workout/`
- **View:** `WorkoutCreateView`
- **Role:** Endpoint to create new workout information.

### 3. Post Exercise
- **Endpoint:** `/exercise/post-exercise/`
- **View:** `ExerciseCreateView`
- **Role:** Endpoint to create new exercise information using existing default workouts or workouts from the workout model.

### 4. Get Exercise by Date
- **Endpoint:** `/exercise/get-exercise-date/`
- **View:** `ExerciseGetByDateView`
- **Role:** Endpoint to get exercise information for a specified date.

### 5. Exercise Update
- **Endpoint:** `/exercise/exercise/update/<int:exercise_id>/`
- **View:** `ExerciseUpdateView`
- **Role:** Endpoint to update specific exercise information.

### 6. Exercise Delete
- **Endpoint:** `/exercise/exercise/delete/<int:pk>/`
- **View:** `ExerciseDeleteView`
- **Role:** Endpoint to delete specific exercise information.

### 7. Get Latest Exercise
- **Endpoint:** `/exercise/get-latest-exercise/`
- **View:** `GetLatestExerciseByTypeView`
- **Role:** Endpoint to get the latest exercise information for each exercise type.

### 8. Create Latest Exercise
- **Endpoint:** `/exercise/create-latest-exercise/`
- **View:** `CreateExercisesWithLatestHistoryByType`
- **Role:** Endpoint to create new exercises based on the latest exercise history for each exercise type.

### Workout Model
- Registers workouts; can distinguish between default workouts and user-created workouts using the `is_default` field.

### Exercise Model
- Registers exercises using the workout model.

<hr>

## meal
### 1. Food Post
- **Endpoint:** `/meal/food/post/`
- **View:** `FoodPostView`
- **Role:** Endpoint to post food items.

### 2. Food List
- **Endpoint:** `/meal/food/list/`
- **View:** `FoodListView`
- **Role:** Endpoint to get a list of saved foods.

### 3. Meal Create
- **Endpoint:** `/meal/meal/create/`
- **View:** `MealCreateView`
- **Role:** Endpoint to create a meal using saved foods.

### 4. Meals by Date
- **Endpoint:** `/meal/meals/date/`
- **View:** `MealByDateView`
- **Role:** Endpoint to get meals for a specified date.

### 5. Meal Update
- **Endpoint:** `/meal/meal/update/<int:meal_id>/`
- **View:** `MealUpdateView`
- **Role:** Endpoint to update specific meal information.

### 6. Meal Delete
- **Endpoint:** `/meal/meal/delete/<int:pk>/`
- **View:** `MealDeleteView`
- **Role:** Endpoint to delete specific meal information.

### 7. Meal Food Search
- **Endpoint:** `/meal/meal/food-search/`
- **View:** `FatSecretSearchAPIView`
- **Role:** Endpoint to search for ingredients using the FatSecret Open API. Supports `&` and `|` operators in the search expression.

### 8. Meal Create with FatSecret
- **Endpoint:** `/meal/meal/create-with-fatsecret/`
- **View:** `CreateMealWithFatSecretFoodAPIView`
- **Role:** Endpoint to create a meal using food items retrieved from the FatSecret Open API.

### 9. Get Searched Food History
- **Endpoint:** `/meal/food/get-searched-food-history/`
- **View:** `GetSearchedFoodHistoryView`
- **Role:** Endpoint for retrieving the history of Foods that have been searched and registered, ordered by the most recent.

### 10. Get Latest Meals
- **Endpoint:** `/meal/meal/latest-meals/`
- **View:** `GetLatestMealsByType`
- **Role:** Endpoint for obtaining the latest Meal information for each meal type.

### 11. Create Latest Meals
- **Endpoint:** `/meal/meal/create-latest/`
- **View:** `CreateMealsWithLatestHistoryByType`
- **Role:** Endpoint for creating new Meals based on the latest Meal information for each meal type.

### Food Model
- Registers food items, includes a field for FatSecret food IDs.

### Meal Model
- Registers meals using the food model.

<hr>

## user_info
### 1. Create or Update UserInfo
- **ENDPOINT:** `/user_info/create-update/`
- **Role:** Create UserInfo. If a record with the same date (date field) already exists, update instead of creating a new one. Weight, height, and metabolism are mandatory. If metabolism is not provided, calculate and assign it using height, weight, account.sex, and account birthday.

### 2. Get Latest UserInfo
- **ENDPOINT:** `/user_info/get-latest/`
- **Role:** Retrieve the latest UserInfo based on the date.

### UserInfo Model
- Register user's physical information for graph creation and other purposes. Please provide a similar format.

<hr>

## goal
### 1. Create or Update Goal
- **ENDPOINT:** `/goal/create-update/`
- **Role:** Endpoint responsible for creating a new Goal. If data already exists, it updates the existing record.

### 2. Get Goal
- **ENDPOINT:** `/goal/get/`
- **Role:** Endpoint for retrieving Goal data.

### Goal Model
- Model for registering user's Goals, primarily used for graph creation.


## pet
### 1. Get Pet , Create Pet every day.
- **ENDPOINT:** `/pet/get-pet/`
- **Role:** Endpoint for creating a Pet based on the pet_date, referencing meal, exercise, and user_info. If a Pet has already been created on that day (pet_date), retrieve the existing Pet.

### Pet Model
- Register user's Pet. The appearance of the Pet displayed in the front-end changes based on body_status and grow.

## main
### 1. Registration Status
- **ENDPOINT:** `/main/registration-status-check/`
- **Role:** Returns a list of data indicating whether meal and exercise have been registered for each date.

### 2. Cals by Date
- **ENDPOINT:** `/main/cals-by-date/`
- **Role:** Returns calorie data (intake_cals, food_cals, bm_cals, exercise_cals) for the specified date.

### 3. PFC by Date
- **ENDPOINT:** `/main/pfc-by-date/`
- **Role:** Returns the amount of protein, fat, and carbohydrates for the specified date.

<hr></hr>

## graph

### 1. Weight Graph
- **Endpoint:** `/graph/weight-graph/`
- **View:** `WeightDataAPIView`
- **Role:** Endpoint for returning weight data from the UserInfo model for each date. If data is not registered for a specific date, the endpoint uses the most recent data.

### 2. Body Fat Percentage Graph
- **Endpoint:** `/graph/body_fat_percentage-graph/`
- **View:** `BodyFatDataAPIView`
- **Role:** Endpoint for returning body_fat_percentage data from the UserInfo model for each date. If data is not registered for a specific date, the endpoint uses the most recent data.

### 3. Muscle Mass Graph
- **Endpoint:** `/graph/muscle_mass-graph/`
- **View:** `MuscleMassDataAPIView`
- **Role:** Endpoint for returning muscle_mass data from the UserInfo model for each date. If data is not registered for a specific date, the endpoint uses the most recent data.

### 4. Total Weight Graph
- **Endpoint:** `/graph/total-weight-graph/`
- **View:** `ExerciseTotalWeightGraphDataAPIView`
- **Role:** Returns data for the total weight of exercise for each body part.

### 5. Daily Nutrients Graph
- **Endpoint:** `/graph/daily-nutrients-graph/`
- **View:** `DailyNutrientsGraphDataAPIView`
- **Role:** Returns nutrient intake data for the specified date.

### 6. Daily Total Weight Graph
- **Endpoint:** `/graph/daily-total-weight-graph/`
- **View:** `DailyExerciseWeightGraphDataAPIView`
- **Role:** Endpoint for returning daily total weight data for a specified body part.

### 7. Calories Graph
- **Endpoint:** `/graph/cals-graph/`
- **View:** `CalGraphAPIView`
- **Role:** Returns daily calorie data (intake_cals, food_cals, exercise_cals, bm_cals).

## Frontend:

### React (vite) Structure
- Organized by components, containers, and pages.
- Components handle small, reusable UI elements.
- Pages bring together containers to create views.

### 1. Account
- component/account/Logout
- pages/auth/Login
- pages/auth/SignUp
- pages/auth/SignUpConfirmation
- pages/auth/PasswordReset
- pages/auth/PasswordResetRequest
- pages/SettingsAccount
- *Token obtained during Login is saved in local storage. It is deleted during Logout.

### 2. Calendar
- components/MainCalendar: Reflects data obtained from main/registration-status-check/ on the calendar. Days with input for meal and exercise are marked with ☑️.

### 3. Dashboard
- pages/Dashboard
- components/dashbord/pet/Pet: Renders images based on pet data obtained from pet/get.

### 4. Meal
- pages/meal/MealsByDate: Retrieves data for the specified date using a query.
- components/meal/meal-nav/MealNavigation
- components/meal/meal-nav/PFCByDate: Horizontal bar graph showing the amount of PFC and balance ratio.
- components/meal/FoodCreate
- components/meal/FoodSearch: Sends a search expression to the backend to get search results. Meals can be registered using the obtained food.
- components/meal/LatestMealsByType
- components/meal/MealCreateForm
- components/meal/MealCreateWithHistory: Create meals from search history.
- components/meal/MealDelete
- components/meal/MealUpdate

### 5. Exercise
- pages/exercise/ExerciseByDate: Retrieves exercise data for the specified date using a query.
- pages/exercise/ExerciseTotalWeightGraph: Displays a bar graph of the total weight of exercise by body part. Also shows the total weight for all parts.
- pages/exercise/DailyExerciseWeightGraph: Displays daily weight data for the specified type as a bar graph.
- components/exercise/exercise-nav/ExerciseNavigation
- components/exercise/ExerciseCreate
- components/exercise/ExerciseDelete
- components/exercise/ExerciseLivingCreate: Creates exercises using workout_type=Living. Only mets and durationminutes are passed.
- components/exercise/ExerciseLivingUpdate: Updates exercises with workout_type=Living. Only durationminutes is passed.
- components/exercise/ExerciseUpdate
- components/exercise/LatestExerciseByType: Retrieves the latest exercises by type for reuse with one click.
- components/exercise/WorkoutCreate

### 6. Goal
- components/goal/GoalNavigation
- pages/goal/Goal: Retrieves user's goal and renders it in a form. It can be updated.

### 7. User Info
- components/user_info/user_info-nav/UserInfoNavigation
- pages/user_info/UserInfo: Retrieves the latest user_info and renders it in a form. It can be created and updated.
- pages/user_info/BodyFatPercentageGraph: Line graph showing changes in body_fat_percentage. Also plots the goal_body_fat.
- pages/user_info/MuscleMassGraph: Line graph showing changes in muscle_mass. Also plots the goal_muscle_mass.
- pages/user_info/WeightGraph: Line graph showing changes in weight. Also plots the goal_weight.
- pages/user_info/CalsGraph: Graph showing changes in calorie balance. Intake_cals is shown as a line graph, and consuming_cals, consisting of exercise_cals, food_cals, and bm_cals, are shown as a stacked bar graph.

### 8. Sub
- components/sub/NavCalendar: Used in meal and exercise nav. Uses useParams to pass color and change accordingly.
- components/sub/CalsByDate: Used in meal and exercise nav. Draws intake_cals, exercise_cals, bm_cals, food_cals for the specified date, as well as goal_intake and goal_consuming.

### 9. Helper
- helpers/getCookie
- helpers/getToday
- helpers/useAuthCheck: Executed at the beginning of page files that require authentication. Checks for the existence of authToken in local storage.

### 10. Redux
- redux/store/ToastSlice
- redux/store/LoadingSlice

## Reference:
### 1. Fat Secret API

- **Overview:** Used for implementing food search functionality.
- **Link:** [Fat Secret API](https://platform.fatsecret.com/platform-api)

### 2. Figma

- **Overview:** Used for designing pet illustrations.

### 3. Icooon-mono

- **Overview:** Used for free icon resources.
- **Link:** [Icooon-mono](https://icooon-mono.com/)

### 4. tailwind

- **Overview:** Used for tailwind styling.
- **Link:** [tailwindcss](https://tailwindcss.com/)

### 5. tailwind

- **Overview:** Used for tailwind styling.
- **Link:** [daisyUI](https://daisyui.com/)

### 6. Xserver

- **Overview:** Used for domain acquisition.
- **Link:** [Xserver](https://www.xserver.ne.jp/)

### 7. AWS EC2

- **Overview:** Used for deploying the application.
- **Link:** [Amazon EC2](https://aws.amazon.com/ec2/)

### 8. Let's Encrypt

- **Overview:** Used for obtaining SSL certificates.


## Conclusion:

EMMA with Pet aims to be a comprehensive tool for users seeking effective support for body transformation, diet, and health maintenance. The combination of accurate data analysis, virtual pet motivation, and user-friendly features sets it apart in the health and fitness app landscape.

© 2024 EMMA with Pet Contributors