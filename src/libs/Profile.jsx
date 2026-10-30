import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";

function Profile() {
  const { user } = useAuth();

  return (
    <Card className="relative mx-auto w-full pt-0">
      <div className="relative w-full">
        {/* Imagen de portada */}
        <div
          aria-label="Event cover"
          className="relative z-10 w-full h-60 bg-repeat-x bg-contain bg-center"
          style={{ backgroundImage: `url('src/assets/closet-sale-profile.jpg')` }}
        />

        {/* Contenedor del Avatar encima */}
        <div className="absolute left-1/2 bottom-0 z-20 w-full -translate-x-1/2 translate-y-1/2 flex justify-center">
          <Avatar className="size-35 border-4 border-background">
            <AvatarImage
              src={user.urlImage}
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      
      <CardContent className="h-full pt-15">
        <form className="h-full">
          <ScrollArea className="h-full w-full">
            <div className="p-4">
              
              <FieldSet>
                <FieldLegend className="text-center pb-10">
                  <span className="text-2xl font-bold block">
                    {user.firstName} {user.lastName}
                  </span>
                </FieldLegend>

                <FieldLegend>Ubicación</FieldLegend>
                <FieldDescription>{user.districtName} / {user.provinceName} / {user.departmentName} </FieldDescription>
              
                <FieldLegend>Whatsapp</FieldLegend>
                <FieldDescription>+51 {user.whatsappNumber}</FieldDescription>
             
              </FieldSet>
            </div>
          </ScrollArea>
        </form>
      </CardContent>
      <CardFooter className="justify-end gap-2">
            
            <Button className="bg-violet-700 hover:bg-violet-800">Editar perfil</Button>
        </CardFooter>
    </Card>
  );
}

export default Profile;
