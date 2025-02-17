import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import MediaSearch from "@/components/MediaSearch";
import { ArrowLeft, Send, Film, Tv, Plus, Wrench, RefreshCw } from "lucide-react";
import { useAuthStore } from "@/stores/auth";

const RequestWizard = () => {
  const [step, setStep] = useState(1);
  const [mediaType, setMediaType] = useState<"movie" | "tv">();
  const [requestType, setRequestType] = useState<string>("");
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const handleMediaTypeSelect = (type: "movie" | "tv") => {
    setMediaType(type);
    setStep(2);
  };

  const handleRequestTypeSelect = (type: string) => {
    setRequestType(type);
    setStep(3);
  };

  const handleMediaSelect = (media: any) => {
    setSelectedMedia(media);
    setStep(4);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: requestType,
          mediaId: selectedMedia.id,
          mediaType: mediaType,
          description: description,
          notifyWhatsapp: true,
        }),
      });

      if (!response.ok) throw new Error("Falha ao enviar solicitação");

      toast({
        title: "✨ Solicitação enviada com sucesso!",
        description: "Você receberá atualizações sobre o status.",
      });
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "❌ Erro ao enviar solicitação",
        description: "Por favor, tente novamente mais tarde.",
      });
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <div className="mb-8 space-y-2">
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold gradient-text">Nova Solicitação</h1>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-colors ${
                i <= step ? "gradient-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
        <p className="text-muted-foreground">Passo {step} de 4</p>
      </div>

      <div className="space-y-6 animate-fade-in">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Qual tipo de conteúdo você deseja solicitar? 🎬
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                size="lg"
                className="h-32 flex flex-col gap-2"
                onClick={() => handleMediaTypeSelect("movie")}
              >
                <Film className="h-8 w-8" />
                <span>Filme</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-32 flex flex-col gap-2"
                onClick={() => handleMediaTypeSelect("tv")}
              >
                <Tv className="h-8 w-8" />
                <span>Série</span>
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              O que você deseja fazer? 🤔
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <Button
                variant="outline"
                size="lg"
                className="h-24 flex gap-4 items-center justify-start px-6"
                onClick={() => handleRequestTypeSelect("add")}
              >
                <Plus className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Adicionar</div>
                  <div className="text-sm text-muted-foreground">
                    Solicitar adição de novo conteúdo
                  </div>
                </div>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-24 flex gap-4 items-center justify-start px-6"
                onClick={() => handleRequestTypeSelect("fix")}
              >
                <Wrench className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Corrigir</div>
                  <div className="text-sm text-muted-foreground">
                    Reportar problemas com o conteúdo
                  </div>
                </div>
              </Button>
              {mediaType === "tv" && (
                <Button
                  variant="outline"
                  size="lg"
                  className="h-24 flex gap-4 items-center justify-start px-6"
                  onClick={() => handleRequestTypeSelect("update")}
                >
                  <RefreshCw className="h-6 w-6" />
                  <div className="text-left">
                    <div className="font-semibold">Atualizar</div>
                    <div className="text-sm text-muted-foreground">
                      Solicitar atualização de episódios
                    </div>
                  </div>
                </Button>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Buscar conteúdo 🔍
            </h2>
            <MediaSearch
              type={mediaType}
              onSelect={handleMediaSelect}
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Detalhes da solicitação ✍️</h2>
            <div className="rounded-lg border p-4 space-y-4">
              <div className="flex items-start space-x-4">
                {selectedMedia.posterPath ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${selectedMedia.posterPath}`}
                    alt={selectedMedia.title}
                    className="w-24 rounded-md"
                  />
                ) : (
                  <div className="w-24 h-36 bg-muted rounded-md flex items-center justify-center">
                    {mediaType === "movie" ? (
                      <Film className="h-8 w-8 text-muted-foreground" />
                    ) : (
                      <Tv className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedMedia.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {mediaType === "movie" ? "Filme" : "Série"} •{" "}
                    {selectedMedia.year}
                  </p>
                </div>
              </div>
              <Textarea
                placeholder="Descreva detalhadamente sua solicitação..."
                className="h-32"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <Button
              className="w-full gradient-primary"
              onClick={handleSubmit}
              disabled={!description}
            >
              Enviar solicitação
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestWizard;