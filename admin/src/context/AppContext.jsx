import { createContext } from "react";

export const AppContext=createContext()
const AppContextProvider=(props)=>{

    const currency="$"
    // const calculateAge=(dob)=>{
    //     const today=new Date()
    //     const birthDate=new Date(dob)
    //     let age=today.getFullYear()-birthDate.getFullYear()
    //     return age
    // }

   const calculateAge = (dob) => {
    console.log('📅 calculateAge called with dob:', dob);
    console.log('📅 dob type:', typeof dob);
    
    if (!dob) {
        console.log('❌ No DOB provided');
        return 'N/A';
    }
    
    // Handle different date formats
    let birthDate;
    
    if (typeof dob === 'string') {
        // Try ISO format (2024-01-30T00:00:00.000Z)
        if (dob.includes('T')) {
            birthDate = new Date(dob);
        }
        // Try date string (1990-05-15)
        else if (dob.includes('-')) {
            birthDate = new Date(dob);
        }
        // Try timestamp (1706659200000)
        else if (!isNaN(dob)) {
            birthDate = new Date(parseInt(dob));
        }
        // Try other formats
        else {
            birthDate = new Date(dob);
        }
    } else if (typeof dob === 'number') {
        // Handle timestamp
        birthDate = new Date(dob);
    } else {
        birthDate = new Date(dob);
    }
    
    console.log('📅 Parsed birthDate:', birthDate);
    
    // Check if date is valid
    if (isNaN(birthDate.getTime())) {
        console.log('❌ Invalid date:', dob);
        return 'N/A';
    }
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // If birthday hasn't occurred this year yet, subtract 1
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    console.log('✅ Calculated age:', age);
    return age;
}

    const month = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

//   const month = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const slotDateFormate = (slotDate) => {
    console.log('🔍 DEBUG slotDate input:', slotDate)
    console.log('🔍 DEBUG slotDate type:', typeof slotDate)
    
    if (!slotDate) {
      console.log('❌ DEBUG: slotDate is null/undefined')
      return 'Date not set'
    }
    
    // Handle different date formats
    if (typeof slotDate === 'string') {
      // Try underscore format first (22_8_2024)
      if (slotDate.includes('_')) {
        const dateArray = slotDate.split('_')
        console.log('🔍 DEBUG underscore format array:', dateArray)
        
        if (dateArray.length === 3) {
          const [day, monthNum, year] = dateArray
          const monthIndex = parseInt(monthNum)
          
          if (monthIndex >= 1 && monthIndex <= 12) {
            return `${day} ${month[monthIndex]} ${year}`
          }
        }
      }
      
      // Try hyphen format (2024-08-22)
      if (slotDate.includes('-')) {
        console.log('🔍 DEBUG hyphen format detected')
        const date = new Date(slotDate)
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })
        }
      }
      
      // Try slash format (22/8/2024)
      if (slotDate.includes('/')) {
        console.log('🔍 DEBUG slash format detected')
        const [day, monthNum, year] = slotDate.split('/')
        const monthIndex = parseInt(monthNum)
        
        if (monthIndex >= 1 && monthIndex <= 12) {
          return `${day} ${month[monthIndex]} ${year}`
        }
      }
    }
    
    console.log('❌ DEBUG: No valid format found')
    return 'Invalid date format'
  }

    const value={
        calculateAge,
        slotDateFormate,
        currency

    }

    return(
        <AppContext.Provider value={value}>

           {props.children}
        </AppContext.Provider>
    )
}
export default AppContextProvider