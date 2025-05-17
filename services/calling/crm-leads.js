

// Function to fetch leads from Follow Up Boss API
export async function fetchFollowUpBossLeads(crmKey) {
    const FOLLOWUP_API_KEY = crmKey
    const FOLLOWUP_API_URL = "https://api.followupboss.com/v1";
    try {
        const response = await fetch(`${FOLLOWUP_API_URL}/people`, {
            method: "GET",
            headers: {
                Authorization: `Basic ${btoa(FOLLOWUP_API_KEY + ":")}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch leads: ${response.statusText}`);
        }

        const data = await response.json();
        return data.people.map(item => transformFollowUpBossLead(item)) || [];
    } catch (error) {
        console.error("Error fetching leads from Follow Up Boss:", error);
        return [];
    }
}

function transformFollowUpBossLead(fubLead) {
    return {
        company_name: fubLead.socialData?.company || "Unknown",
        contact_name: fubLead.name || `${fubLead.firstName} ${fubLead.lastName}`,
        phone: fubLead.phones?.length > 0 ? fubLead.phones[0].value : null,
        email: fubLead.emails?.length > 0 ? fubLead.emails[0].value : null,
        timezone: "America/New_York", // Default, as it's missing in FUB
    };
}