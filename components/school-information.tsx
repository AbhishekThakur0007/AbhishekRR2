import React from "react";
import { MLSListing, PropertyDetailResponse } from "@/app/types/real-estate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, Star, Info, MapPin } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SchoolInformationProps {
  propertyData?: PropertyDetailResponse | null;
  mlsData?: MLSListing | null;
}

interface SchoolData {
  name: string;
  type: string;
  grades: string;
  rating?: number;
  parentRating?: number;
  enrollment?: number;
  distance?: string;
  address?: string;
}

export function SchoolInformation({
  propertyData,
  mlsData,
}: SchoolInformationProps) {
  // If no data, return nothing
  if (!propertyData && !mlsData) {
    return null;
  }

  // Extract and combine school data from both APIs
  const getSchools = (): {
    elementary: SchoolData[];
    middle: SchoolData[];
    high: SchoolData[];
  } => {
    const schools = {
      elementary: [] as SchoolData[],
      middle: [] as SchoolData[],
      high: [] as SchoolData[],
    };

    // Add schools from Property Detail API
    if (
      propertyData?.data?.schools &&
      Array.isArray(propertyData.data.schools) &&
      propertyData.data.schools.length > 0
    ) {
      propertyData.data.schools.forEach((school: any) => {
        const schoolData: SchoolData = {
          name: school.name,
          type: school.type,
          grades: school.grades,
          rating: school.rating,
          parentRating: school.parentRating,
          enrollment: school.enrollment,
          address: `${school.street}, ${school.city}, ${school.state} ${school.zip}`,
        };

        // Determine the level based on the levels property, if available
        if (school.levels) {
          if (school.levels.elementary) {
            schools.elementary.push(schoolData);
          } else if (school.levels.middle) {
            schools.middle.push(schoolData);
          } else if (school.levels.high) {
            schools.high.push(schoolData);
          }
        } else {
          // Fallback to inferring from grades
          const grades = school.grades?.toLowerCase() || "";
          if (
            grades.includes("k") ||
            grades.includes("elementary") ||
            /pk-\d/.test(grades) ||
            /k-\d/.test(grades)
          ) {
            schools.elementary.push(schoolData);
          } else if (
            grades.includes("middle") ||
            grades.includes("junior") ||
            /\d-8/.test(grades)
          ) {
            schools.middle.push(schoolData);
          } else if (
            grades.includes("high") ||
            grades.includes("9-12") ||
            grades.includes("senior")
          ) {
            schools.high.push(schoolData);
          }
        }
      });
    }

    // Add schools from MLS API if not already present
    if (mlsData?.schools && Array.isArray(mlsData.schools)) {
      mlsData.schools.forEach((school) => {
        const schoolData: SchoolData = {
          name: school.name,
          type: school.type,
          grades: school.grade,
          rating: school.rating,
          enrollment: school.studentCount,
          address: `${school.address}, ${school.city}, ${school.state} ${school.zip}`,
        };

        // Categorize based on grade level
        const grade = school.grade.toLowerCase();
        if (
          grade.includes("k") ||
          grade.includes("elementary") ||
          /pk-\d/.test(grade) ||
          /k-\d/.test(grade)
        ) {
          if (!schools.elementary.some((s) => s.name === school.name)) {
            schools.elementary.push(schoolData);
          }
        } else if (
          grade.includes("middle") ||
          grade.includes("junior") ||
          /\d-8/.test(grade)
        ) {
          if (!schools.middle.some((s) => s.name === school.name)) {
            schools.middle.push(schoolData);
          }
        } else if (
          grade.includes("high") ||
          grade.includes("9-12") ||
          grade.includes("senior")
        ) {
          if (!schools.high.some((s) => s.name === school.name)) {
            schools.high.push(schoolData);
          }
        }
      });
    }

    return schools;
  };

  const schools = getSchools();

  // If no schools available, return nothing
  if (
    schools.elementary.length === 0 &&
    schools.middle.length === 0 &&
    schools.high.length === 0
  ) {
    return null;
  }

  // Get the school district
  const schoolDistrict =
    propertyData?.data?.schools?.[0]?.district ||
    "School district information unavailable";

  // Render a single school card
  const renderSchoolCard = (school: SchoolData) => (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-foreground">{school.name}</h3>
              <p className="text-xs text-muted-foreground">
                {school.type} • {school.grades}
              </p>
            </div>
            {school.rating && (
              <div className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-semibold">
                <Star className="h-3.5 w-3.5 mr-1" />
                <span>{school.rating}/10</span>
              </div>
            )}
          </div>

          {school.enrollment && (
            <div className="flex items-center mt-2 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5 mr-1.5" />
              <span>
                Enrollment: {school.enrollment.toLocaleString()} students
              </span>
            </div>
          )}

          {school.address && (
            <div className="flex items-center mt-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 mr-1.5" />
              <span>{school.address}</span>
            </div>
          )}

          {school.rating && (
            <div className="mt-3">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-muted-foreground">Rating</span>
                <span className="font-medium">{school.rating}/10</span>
              </div>
              <Progress value={school.rating * 10} className="h-1.5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-foreground mb-1">Schools</h2>
        {schoolDistrict && (
          <p className="text-muted-foreground text-sm">
            <span className="font-medium">District:</span> {schoolDistrict}
          </p>
        )}
      </div>

      {/* Elementary Schools */}
      {schools.elementary.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <GraduationCap className="h-5 w-5 mr-2 text-primary" />
            Elementary Schools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schools.elementary.map((school, index) => (
              <React.Fragment key={`elementary-${index}`}>
                {renderSchoolCard(school)}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Middle Schools */}
      {schools.middle.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mt-6 mb-3 flex items-center">
            <GraduationCap className="h-5 w-5 mr-2 text-primary" />
            Middle Schools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schools.middle.map((school, index) => (
              <React.Fragment key={`middle-${index}`}>
                {renderSchoolCard(school)}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* High Schools */}
      {schools.high.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mt-6 mb-3 flex items-center">
            <GraduationCap className="h-5 w-5 mr-2 text-primary" />
            High Schools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schools.high.map((school, index) => (
              <React.Fragment key={`high-${index}`}>
                {renderSchoolCard(school)}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-4">
        School attendance boundaries are subject to change. Check with the
        applicable school district for current information.
      </p>
    </div>
  );
}
