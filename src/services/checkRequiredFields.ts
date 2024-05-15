import { BookingDTO } from "parking-sdk";

export function checkRequiredFields(booking: BookingDTO){
    const requiredFields = [ 
        'name',
        'phone',
        'email',
        'departureDate',
        'arrivalDate',
        'registrationNumber',
        'resource',
        'qtyPersons',
        // 'vehicleType',
        // 'engineType'
    ]
    const phonePattern = /^(\+46|0)7[02369]\s*\d{4}\s*\d{3}$/
    // TODO: validator for phone number
    requiredFields.forEach(field => console.log(booking[field as keyof BookingDTO]))
    return requiredFields.every((field: string) => booking[field as keyof BookingDTO])
}

