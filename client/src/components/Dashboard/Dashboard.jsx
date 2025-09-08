import useDashboard from './hooks/useDashboard';
import CurrentPlans from './components/CurrentPlans';
import GeneratePlans from './components/GeneratePlans';
import Navbar from './components/Navbar';
import MobileMenu from './components/MobileMenu';
import DietPlanForm from './DietPlanForm';
import WorkoutPlanForm from './WorkoutPlanForm';

const Dashboard = () => {
  const {
    user,
    dietPreferences,
    workoutPreferences,
    currentDietPlan,
    currentWorkoutPlan,
    isGeneratingDietPlan,
    isGeneratingWorkoutPlan,
    showDietForm,
    showWorkoutForm,
    showUserSection,
    mobileMenuOpen,
    setMobileMenuOpen,
    toggleUserSection,
    handleCurrentDietPlanDetails,
    handleCurrentWorkoutPlanDetails,
    handleGenerateDietPlan,
    handleGenerateWorkoutPlan,
    handleLogout,
    handleDeleteAccount,
    closeDietForm,
    closeWorkoutForm,
    handleDietFormSubmit,
    handleWorkoutFormSubmit,
  } = useDashboard();

  return (
    <div className="min-h-screen bg-dark text-light">
      <Navbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
      />

      <MobileMenu
        mobileMenuOpen={mobileMenuOpen}
        showUserSection={showUserSection}
        toggleUserSection={toggleUserSection}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Content */}
      <div className="md:pt-16 pt-20 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="bg-dark/50 backdrop-blur-lg rounded-lg border border-primary/20 p-6">
            <div
              className={`grid ${
                !dietPreferences && !workoutPreferences
                  ? 'md:grid-cols-1'
                  : !dietPreferences || !workoutPreferences
                  ? 'md:grid-cols-2'
                  : 'md:grid-cols-3'
              } gap-6`}>
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-bold text-primary mb-4">
                  Personal Information
                </h2>
                <div className="space-y-3">
                  <div className="bg-dark/30 rounded-lg p-4 border border-primary/10">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">
                          {user?.name?.[0]?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {user?.name || 'N/A'}
                        </h3>
                        <p className="text-light/60">{user?.email || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-light/60">Age</p>
                        <p className="font-medium">{user?.age || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-light/60">Gender</p>
                        <p className="font-medium">{user?.gender || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Diet Preferences - Only show if preferences exist */}
              {dietPreferences && Object.keys(dietPreferences).length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-primary mb-4">
                    Diet Preferences
                  </h2>
                  <div className="bg-dark/30 rounded-lg p-4 border border-primary/10 space-y-3">
                    <div>
                      <p className="text-light/60">Goal</p>
                      <p className="font-medium">
                        {dietPreferences.dietGoal || 'Not set'}
                      </p>
                    </div>
                    <div>
                      <p className="text-light/60">Diet Type</p>
                      <p className="font-medium">
                        {dietPreferences.dietType || 'Not set'}
                      </p>
                    </div>
                    <div>
                      <p className="text-light/60">Allergies</p>
                      <p className="font-medium">
                        {dietPreferences.allergies?.join(', ') || 'None'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Workout Preferences - Only show if preferences exist */}
              {workoutPreferences &&
                Object.keys(workoutPreferences).length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-primary mb-4">
                      Workout Preferences
                    </h2>
                    <div className="bg-dark/30 rounded-lg p-4 border border-primary/10 space-y-3">
                      <div>
                        <p className="text-light/60">Goal</p>
                        <p className="font-medium">
                          {workoutPreferences.workoutGoal || 'Not set'}
                        </p>
                      </div>
                      <div>
                        <p className="text-light/60">Activity Level</p>
                        <p className="font-medium">
                          {workoutPreferences.activityLevel || 'Not set'}
                        </p>
                      </div>
                      <div>
                        <p className="text-light/60">Days Per Week</p>
                        <p className="font-medium">
                          {workoutPreferences.workoutDaysPerWeek || 'Not set'}
                        </p>
                      </div>
                      <div>
                        <p className="text-light/60">Medical Conditions</p>
                        <p className="font-medium">
                          {workoutPreferences.healthConditions?.join(', ') ||
                            'None'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>

          <CurrentPlans
            currentDietPlan={currentDietPlan}
            currentWorkoutPlan={currentWorkoutPlan}
            onViewDietPlan={handleCurrentDietPlanDetails}
            onViewWorkoutPlan={handleCurrentWorkoutPlanDetails}
          />

          {/* Generate Plans Section */}
          <GeneratePlans
            isGeneratingDietPlan={isGeneratingDietPlan}
            isGeneratingWorkoutPlan={isGeneratingWorkoutPlan}
            onDietClick={handleGenerateDietPlan}
            onWorkoutClick={handleGenerateWorkoutPlan}
          />

          {/* Diet Plan Form Modal */}
          {showDietForm && <DietPlanForm onClose={closeDietForm} />}

          {/* Workout Plan Form Modal */}
          {showWorkoutForm && <WorkoutPlanForm onClose={closeWorkoutForm} />}
        </div>
      </div>
      {showDietForm && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={closeDietForm}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
              className="bg-dark rounded-lg border border-primary/20 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}>
              <DietPlanForm
                onSubmit={handleDietFormSubmit}
                onClose={closeDietForm}
              />
            </div>
          </div>
        </>
      )}

      {/* Workout Plan Form Modal */}
      {showWorkoutForm && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={closeWorkoutForm}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
              className="bg-dark rounded-lg border border-primary/20 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}>
              <WorkoutPlanForm
                onSubmit={handleWorkoutFormSubmit}
                onClose={closeWorkoutForm}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
