import {Header} from "../../../components";
import {ComboBoxComponent} from "@syncfusion/ej2-react-dropdowns";
import type { Route } from './+types/create-trip'
import {comboBoxItems, selectItems} from "~/constants";
import {cn, formatKey} from "~/lib/utils";
import {LayerDirective, LayersDirective, MapsComponent} from "@syncfusion/ej2-react-maps";
import React, {useState} from "react";
import {world_map} from "~/constants/world_map";
import {ButtonComponent} from "@syncfusion/ej2-react-buttons";
import {account} from "~/appwrite/client";
import {useNavigate} from "react-router";

export const loader = async () => {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all', {
            headers: {
                'Accept': 'application/json',
            },
        });
        
        if (!response.ok) {
            console.warn(`Countries API returned ${response.status}: ${response.statusText}`);
            // Return fallback data if API fails
            return getFallbackCountries();
        }
        
        const data = await response.json();

        if (!Array.isArray(data)) {
            console.warn('Invalid data format from countries API');
            return getFallbackCountries();
        }

        return data.map((country: any) => ({
            name: (country.flag || '🌍') + ' ' + country.name.common,
            coordinates: country.latlng || [0, 0],
            value: country.name.common,
            openStreetMap: country.maps?.openStreetMap || '',
        }))
    } catch (error) {
        console.error('Error loading countries:', error);
        return getFallbackCountries();
    }
}

// Fallback countries list
const getFallbackCountries = (): Country[] => {
    return [
        { name: '🇺🇸 United States', coordinates: [37.09024, -95.712891], value: 'United States', openStreetMap: 'https://www.openstreetmap.org/relation/148838' },
        { name: '🇬🇧 United Kingdom', coordinates: [55.378051, -3.435973], value: 'United Kingdom', openStreetMap: 'https://www.openstreetmap.org/relation/62149' },
        { name: '🇫🇷 France', coordinates: [46.227638, 2.213749], value: 'France', openStreetMap: 'https://www.openstreetmap.org/relation/1403916' },
        { name: '🇩🇪 Germany', coordinates: [51.165691, 10.451526], value: 'Germany', openStreetMap: 'https://www.openstreetmap.org/relation/51477' },
        { name: '🇮🇹 Italy', coordinates: [41.87194, 12.56738], value: 'Italy', openStreetMap: 'https://www.openstreetmap.org/relation/365331' },
        { name: '🇪🇸 Spain', coordinates: [40.463667, -3.74922], value: 'Spain', openStreetMap: 'https://www.openstreetmap.org/relation/1311341' },
        { name: '🇯🇵 Japan', coordinates: [36.204824, 138.252924], value: 'Japan', openStreetMap: 'https://www.openstreetmap.org/relation/382313' },
        { name: '🇦🇺 Australia', coordinates: [-25.274398, 133.775136], value: 'Australia', openStreetMap: 'https://www.openstreetmap.org/relation/80500' },
        { name: '🇨🇦 Canada', coordinates: [56.130366, -106.346771], value: 'Canada', openStreetMap: 'https://www.openstreetmap.org/relation/1428125' },
        { name: '🇧🇷 Brazil', coordinates: [-14.235004, -51.92528], value: 'Brazil', openStreetMap: 'https://www.openstreetmap.org/relation/59470' },
        { name: '🇮🇳 India', coordinates: [20.593684, 78.96288], value: 'India', openStreetMap: 'https://www.openstreetmap.org/relation/304716' },
        { name: '🇲🇽 Mexico', coordinates: [23.634501, -102.552784], value: 'Mexico', openStreetMap: 'https://www.openstreetmap.org/relation/114686' },
        { name: '🇹🇭 Thailand', coordinates: [15.870032, 100.992541], value: 'Thailand', openStreetMap: 'https://www.openstreetmap.org/relation/2067731' },
        { name: '🇬🇷 Greece', coordinates: [39.074208, 21.824312], value: 'Greece', openStreetMap: 'https://www.openstreetmap.org/relation/192307' },
        { name: '🇨🇭 Switzerland', coordinates: [46.818188, 8.227512], value: 'Switzerland', openStreetMap: 'https://www.openstreetmap.org/relation/51701' },
    ];
}

const CreateTrip = ({ loaderData }: Route.ComponentProps ) => {
    const countries = loaderData as Country[];
    const navigate = useNavigate();

    const [formData, setFormData] = useState<TripFormData>({
        country: countries[0]?.name || '',
        travelStyle: '',
        interest: '',
        budget: '',
        duration: 0,
        groupType: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
       e.preventDefault()
        setLoading(true);

       if(
           !formData.country ||
           !formData.travelStyle ||
           !formData.interest ||
           !formData.budget ||
           !formData.groupType
       ) {
           setError('Please provide values for all fields');
           setLoading(false)
           return;
       }

       if(formData.duration < 1 || formData.duration > 10) {
           setError('Duration must be between 1 and 10 days');
           setLoading(false)
           return;
       }
       const user = await account.get();
       if(!user.$id) {
           console.error('User not authenticated');
           setLoading(false)
           return;
       }

       try {
           const response = await fetch('/api/create-trip', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json'},
               body: JSON.stringify({
                   country: formData.country,
                   numberOfDays: formData.duration,
                   travelStyle: formData.travelStyle,
                   interests: formData.interest,
                   budget: formData.budget,
                   groupType: formData.groupType,
                   userId: user.$id
               })
           })

           if (!response.ok) {
               throw new Error(`API request failed with status ${response.status}`);
           }

           const result: CreateTripResponse = await response.json();

           if(result?.id) {
               navigate(`/trips/${result.id}`)
           } else if(result?.error) {
               setError(result.error);
           } else {
               setError('Failed to generate a trip. Please try again.');
           }
       } catch (e) {
           console.error('Error generating trip', e);
           setError('Failed to generate trip. Please check your connection and try again.');
       } finally {
           setLoading(false)
       }
    };

    const handleChange = (key: keyof TripFormData, value: string | number)  => {
    setFormData({ ...formData, [key]: value})
    }
    const countryData = countries.map((country) => ({
        text: country.name,
        value: country.value,
    }))

    const mapData = [
        {
            country: formData.country,
            color: '#EA382E',
            coordinates: countries.find((c: Country) => c.name === formData.country)?.coordinates || []
        }
    ]

    return (
        <main className="flex flex-col gap-10 pb-20 wrapper">
            <Header title="Add a New Trip" description="View and edit AI Generated travel plans" />

            <section className="mt-2.5 wrapper-md">
                <form className="trip-form" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="country">
                            Country
                        </label>
                        <ComboBoxComponent
                            id="country"
                            dataSource={countryData}
                            fields={{ text: 'text', value: 'value' }}
                            placeholder="Select a Country"
                            className="combo-box"
                            change={(e: { value: string | undefined }) => {
                                if(e.value) {
                                    handleChange('country', e.value)
                                }
                            }}
                            allowFiltering
                            filtering={(e) => {
                                const query = e.text.toLowerCase();

                                e.updateData(
                                    countries.filter((country) => country.name.toLowerCase().includes(query)).map(((country) => ({
                                        text: country.name,
                                        value: country.value
                                    })))
                                )
                            }}
                        />
                    </div>

                    <div>
                        <label htmlFor="duration">Duration</label>
                        <input
                            id="duration"
                            name="duration"
                            type="number"
                            placeholder="Enter a number of days"
                            className="form-input placeholder:text-gray-100"
                            onChange={(e) => handleChange('duration', Number(e.target.value))}
                        />
                    </div>

                    {selectItems.map((key) => (
                        <div key={key}>
                            <label htmlFor={key}>{formatKey(key)}</label>

                            <ComboBoxComponent
                                id={key}
                                dataSource={comboBoxItems[key].map((item) => ({
                                    text: item,
                                    value: item,
                                }))}
                                fields={{ text: 'text', value: 'value'}}
                                placeholder={`Select ${formatKey(key)}`}
                                change={(e: { value: string | undefined }) => {
                                    if(e.value) {
                                        handleChange(key, e.value)
                                    }
                                }}
                                allowFiltering
                                filtering={(e) => {
                                    const query = e.text.toLowerCase();

                                    e.updateData(
                                        comboBoxItems[key]
                                            .filter((item) => item.toLowerCase().includes(query))
                                            .map(((item) => ({
                                                text: item,
                                                value: item,
                                            }))))}}
                                className="combo-box"
                            />
                        </div>
                    ))}

                    <div>
                        <label htmlFor="location">
                            Location on the world map
                        </label>
                        <MapsComponent>
                            <LayersDirective>
                                <LayerDirective
                                    shapeData={world_map}
                                    dataSource={mapData}
                                    shapePropertyPath="name"
                                    shapeDataPath="country"
                                    shapeSettings={{ colorValuePath: "color", fill: "#E5E5E5" }}
                                />
                            </LayersDirective>
                        </MapsComponent>
                    </div>

                    <div className="bg-gray-200 h-px w-full" />

                    {error && (
                        <div className="error">
                            <p>{error}</p>
                        </div>
                    )}
                    <footer className="px-6 w-full">
                        <ButtonComponent type="submit"
                            className="button-class !h-12 !w-full" disabled={loading}
                        >
                            <img src={`/assets/icons/${loading ? 'loader.svg' : 'magic-star.svg'}`} className={cn("size-5", {'animate-spin': loading})} />
                            <span className="p-16-semibold text-white">
                                {loading ? 'Generating...' : 'Generate Trip'}
                            </span>
                        </ButtonComponent>
                    </footer>
                </form>
            </section>
        </main>
    )
}
export default CreateTrip
