import WorkoutProfile from "../forms/WorkoutProfileDelete";



async function RightSidebar() {

  return (
    <section className='custom-scrollbar rightsidebar'>
      <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-center text-heading4-medium text-light-1'>
          Manage Workouts:
          <WorkoutProfile />
        </h3>


      </div>
    </section>
  );
}

export default RightSidebar;