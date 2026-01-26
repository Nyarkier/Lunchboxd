interface TeamMember {
  name: string;
  image: string;
  description: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Rainer Dela Paz Yumul",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    description:
      "UI/UX Designer | Digital Marketing Specialist | Social Media Strategist",
  },
  {
    name: "Prince Lord Mendoza",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    description: "Project Engineer | Frontend Developer | Public Relations ",
  },
  {
    name: "Kurt Valerio",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    description: "Backend Developer",
  },
  {
    name: "Quim Joram Juan",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    description: "Backend Developer",
  },
];

const TeamCard = ({ member, index }: { member: TeamMember; index: number }) => {
  return (
    <div
      className="flex flex-col items-center text-center animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Profile Image with Orange Ring */}
      <div className="relative mb-4">
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-orange shadow-lg">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Name */}
      <h3 className="text-lg font-bold text-navy mb-2">{member.name}</h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed max-w-50">
        {member.description}
      </p>
    </div>
  );
};

const TeamSection = () => {
  return (
    <section className="py-16 px-4 bg-sand">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {teamMembers.map((member, index) => (
            <TeamCard key={index} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
