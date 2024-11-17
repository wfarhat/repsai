import WorkoutProfile from "../workouts/WorkoutProfileDelete";

async function RightSidebar() {
  return (
    <section className='custom-scrollbar rightsidebar'>
      <div className='flex flex-1 flex-col justify-start'>
        {/* Header for the workout management section */}
        <h3 className='text-center text-heading4-medium text-light-1'>
          Manage Workouts:
          {/* Display the WorkoutProfile component */}
          <WorkoutProfile /> 
        </h3>
      </div>
    </section>
  );
}

export default RightSidebar;
